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

	// zipArchive.glob([
	// 	{ cwd: srcFolder, src: ['**/*', '!archive.mext'], expand: true }
	// ])

	// const zipGlob = path.join(process.cwd(), '**/*')

	// console.log('path', zipGlob)

	zipArchive.glob('**/!(collections.mext)', {
		cwd: process.cwd()
	})

	zipArchive.finalize(function(err) {
		if(err) {
			callback(err)
		}
	})
}

module.exports = zipFolder