var fs = require('fs')
var chalk = require('chalk')
var zipFolder = require('zip-folder')
var path = require('path')
var yargs = require('yargs')
var del = require('del')

module.exports = function zipCurrentDirectory(cb) {
	var configFilePath = path.join(process.cwd(), yargs.argv.config)
	var filename;
	try {
		filename = require(configFilePath).filename
	} catch (error) {
		filename = process.cwd().split(path.sep).pop() + '.interactive'
	}

	var Spinner = require('cli-spinner').Spinner
	var spinner = new Spinner('Generating ' + filename + '...')
	spinner.setSpinnerString(1)
	spinner.start()

	try {
		del.sync(path.join(process.cwd(), '*.interactive'))
	} catch(err) {}
	
	zipFolder(process.cwd(), 'archive.interactive', function() {
		fs.renameSync('archive.interactive', filename)
		spinner.stop()
		console.log(chalk.green('Created ' + filename))
		cb()
	})
}