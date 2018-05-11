var chalk = require('chalk')
var browserSync = require('browser-sync')
var os = require('os')
var ip = require('ip')
var fs = require('fs')
var path = require('path')
var logClient = fs.readFileSync(
	path.join(__dirname, 'public/logClient.js'), { encoding: 'UTF-8' }
)

module.exports = function(options) {
	var viewerMiddleware = require('./middleware')(options)
	var exp = new RegExp('(.*)/(.*)/interactive/(.*)/index.html')
	var mcode = options.mcode

	//Deprecated option url
	if (options.url) {
		mcode = options.url.match(exp)[2]
	}

	//Allow any SSL certificate
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

	browserSync.create().init({
		files: './**',
		https: true,
		open: 'external',
		startPath: '/' + mcode,
		rewriteRules: [{
			match: /<head>/i,
			replace: '<head><script>' + logClient +'</script>'
		}],
		watchOptions: {
			ignoreInitial: true,
			ignored: [ '**/*.log' ]
		},
		server: {
			baseDir: '.',
			middleware: [
				viewerMiddleware
			]
		}
	}, function(err, bs) {
		require('./socketLogger')(bs.io.sockets)
		require('./servicePublisher').publish(os.hostname(), bs.options.get('port'), options.mcode, options.slug, ip.address())

		var manifestPath = path.join(process.cwd(), 'interactive-manifest.json')
		var manifestExists = fs.existsSync(manifestPath)

		if (!manifestExists) {

			return console.log(chalk.red('WARNING: This Extension is missing `interactive-manifest.json` file. Adding this file will allow the Extension to leverage some important enhancements to the apps. Run command "extension-cli init" again to have the file added to the root of your Extension.'))
		}

		//TODO: uncomment this when iOS implements WKWebView support
		// var manifest = JSON.parse(fs.readFileSync(manifestPath))

		// if (!manifest.wkwebview) {
		// 	console.log(chalk.red('WARNING: This Extension does not target WKWebView on iOS. Run command "extension-cli init" again to have configure this Extension to target WKWebView.'))
		// }
	})
}