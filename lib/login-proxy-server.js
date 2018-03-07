var chalk = require('chalk')
var browserSync = require('browser-sync')
var modRewrite = require('connect-modrewrite')

module.exports = function(options) {

	let loginDomain = options.loginDomain

	//Allow any SSL certificate
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

	if (!loginDomain) {
		loginDomain = 'https://login.mediafly.com'
	}

	browserSync.create().init({
		https: true,
		port: 8188,
		ui: false,
		open: false,
		server: {
			baseDir: '.',
			middleware: [
				modRewrite([
					`^/(.*)$ ${loginDomain}/$1 [P]`
				])
			]
		}
	}, function(err) {

		if (err) {
			console.log(chalk.red('WARNING: Unable to start the login proxy server on port 8188.'))
		}
	})
}