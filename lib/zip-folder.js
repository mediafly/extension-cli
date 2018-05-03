var fs = require('fs')
var path = require('path')
var archiver = require('archiver')

function zipFolder(srcFolder, zipFilePath, callback) {
	var output = fs.createWriteStream(zipFilePath)
	var zipArchive = archiver('zip')

	output.on('close', function() {
		callback()
	})

	zipArchive.pipe(output)
	zipArchive.glob('**/!(*.mext)', {
		cwd: process.cwd()
	})

	zipArchive.finalize(function(err) {
		if(err) {
			callback(err)
		}
	})
}

module.exports = zipFolder