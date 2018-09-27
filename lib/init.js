var inquirer = require('inquirer')
var util = require('./util')
var fs = require('fs')
var chalk = require('chalk')
var path = require('path')
var yargs = require('yargs')
var configFilePath = path.join(process.cwd(), yargs.argv.config)

module.exports = function init(cb) {
	var options = {}
	try {
		options = require(configFilePath)
	} catch (err) {}

	inquirer.prompt([{
		default: options.mcode || 'interactives',
		name: 'mcode',
		message: 'Enter Company Code'
	}]).then(function(answers) {
		var mcode = answers.mcode
		util.getProduct(answers.mcode, function(product) {
			util.promptForAccessToken(answers.mcode, product)
				.then(function(accessToken) {
					inquirer.prompt([{
						default: options.folderId,
						name: 'folderId',
						message: 'Enter Airship folder Id'
					}, {
						default: process.cwd().split(path.sep).pop(),
						name: 'filename',
						message: 'Enter the name of the .mext file (without the .mext extension)'
					}, {
						default: 0,
						choices: [ 'WebView', 'WKWebView' ],
						name: 'iOSEnvironment',
						message: 'Load Extension on iOS in',
						type: 'list'
					}]).then(function(answers) {

						util.createItem({
							type: 'file',
							parentId: answers.folderId,
							metadata: {
								title: answers.filename
							}
						}, accessToken, product.id, (item) => {

							var data = {
								filename: answers.filename + '.mext',
								folderId: answers.folderId,
								itemId: item.id,
								mcode: mcode,
								slug: item.slug,
								productId: product.id
							}

							fs.writeFileSync(yargs.argv.config, JSON.stringify(data, null, 4))
							fs.writeFileSync(path.join(__dirname, '../token.json'), JSON.stringify({ accessToken }, null, 4))
							fs.writeFileSync('interactive-manifest.json', JSON.stringify({ wkwebview: answers.iOSEnvironment === 'WKWebView' }, null, 4))
							console.log(chalk.green('Initialized successfully!'))
							cb()
						})
					})
				})
		})
	})
}