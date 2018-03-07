var request = require('request')
var chalk = require('chalk')
var inquirer = require('inquirer')
var path = require('path')
var yargs = require('yargs')
var Q = require('q')
var opn = require('opn')

function getViewerItemSlug(itemId, accessToken, productId, cb) {
	var url = 'https://launchpadapi.mediafly.com/2/items/' + itemId +
		'?accessToken=' + accessToken + '&productId=' + productId

	request.get({url: url, json: true}, function(err, response, item) {
			if (err) {
				console.log(chalk.red('Error getting viewer item slug.'))
				return
			}
			cb(item.response.slug)
		})
}

function getProduct(mcode, cb) {
	var url = 'https://accounts.mediafly.com/api/3.0/products/get?mcode=' + mcode + '&accessToken=__anonymous__'

	request({
		json: true,
		uri: url
	}, function(err, response, product) {
		cb(product)
	})
}

function getAccessToken(userId, password, cb) {
	var url = 'https://accounts.mediafly.com/api/3.3/authentication/authenticate?accessType=edit&username=' + 
			encodeURIComponent(userId) + '&password= ' + encodeURIComponent(password)

	request.get({url: url, json: true}, function(err, response, body) {
			if (err) {
				console.log(chalk.red('Error authenticating. Please check your credentials.'))
				return
			}
			cb(body.accessToken)
		})
}

function promptForAccessToken(mcode, product) {
	if (product.authentication.authenticationType === 'Url') {
		//this content source is SAML
		console.log('Log in with your credentials in the newly opened browser window.')
		console.log('Once you have logged in, copy the Access Token and paste it below.')
		return opn(`${product.authentication.url}&returnUrl=https%3A%2F%2Fmediafly-mfly-interactive.s3.amazonaws.com%2Faccess-token.html`, { wait: false }).then(function() {
			return inquirer.prompt([{
				name: 'accessToken',
				message: 'Enter Access Token'
			}]).then(function(answers) { return answers.accessToken })
		})
	} else {
		//this is a regular content source
		return inquirer.prompt([{
			name: 'userId',
			message: 'Enter Airship User Id'  
		}, {
			name: 'password',
			message: 'Enter Airship password',
			type: 'password'
		}]).then(function(answers) {
			return new Q.Promise(function(resolve) {
				getAccessToken(answers.userId, answers.password, function(accessToken) {
					resolve(accessToken)
				})
			})
		})
	}
}

function renewAccessToken(cb) {
	var configFilePath = path.join(process.cwd(), yargs.argv.config)
	var options = {}
	try {
		options = require(configFilePath)
	} catch (err) {}
	getProduct(options.mcode, function(product) {
		promptForAccessToken(options.mcode, product)
			.then(function(accessToken) {
				cb(accessToken)
			})
	})
}

module.exports = {
	getAccessToken: getAccessToken,
	getViewerItemSlug: getViewerItemSlug,
	getProduct: getProduct,
	promptForAccessToken: promptForAccessToken,
	renewAccessToken: renewAccessToken
}