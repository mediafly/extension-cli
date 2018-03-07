#!/usr/bin/env node
var path = require('path')
var yargs = require('yargs')
var opn = require('opn')
var chalk = require('chalk')
var release = require('../lib/release')
require('../lib/updateNotifier')
require('../lib/configureWinston')

function upload() {
	var configFilePath = path.join(process.cwd(), yargs.argv.config)
	var options = require(configFilePath)
	require('../lib/publish')(options.accessToken, options.productId, options.itemId)
}

function serve() {
	var configFilePath = path.join(process.cwd(), yargs.argv.config)
	var options = require(configFilePath)
	require('../lib/login-proxy-server')(options)
	require('../lib/server')(options)

}

function getVersion() {
	var version = require('../package').version
	return console.log(`Version: ${chalk.green(version)}`)
}

function openInAirship() {
	var configFilePath = path.join(process.cwd(), yargs.argv.config)
	var options = require(configFilePath)
	var itemId = options.itemId
	var mcode = options.mcode
	console.log(`Open item ${itemId} in Airship`)
	opn(`https://airship.mediafly.com/${mcode}#/mediamanager/content/${itemId}`, { wait: false })
}

function openInViewer() {
	var configFilePath = path.join(process.cwd(), yargs.argv.config)
	var options = require(configFilePath)
	var slug = options.slug
	var mcode = options.mcode
	console.log(`Open slug ${slug} in Viewer`)
	opn(`https://viewer.mediafly.com/${mcode}/redirect?slug=${slug}`, { wait: false })
}

yargs
	.usage('Run the Extension with the following options.')
	.option('config', {
		alias: 'c',
		description: 'Name of the config file to use',
		default: 'mfly-interactive.config.json'
	})
	.command('version', 'Get version', function() {
		getVersion()
	})
	.command('serve', 'Serves it up', function() {
		serve()
	})
	.command('init', 'Initialize', function() {
		require('../lib/init')()
	})
	.command('publish', 'Create release and upload to Airship', function() {
		upload()
	})
	.command('open', 'open item in', function(yargs) {
		return yargs
			.command('airship', 'airship', function() {
				openInAirship()
			})
			.command('viewer', 'viewer', function() {
				openInViewer()
			})
	})
	.command('release', 'Create the .interactive archive', function() {
		release(function(err) {
			if (err) {
				console.log(err)
			}
		})
	}).argv
