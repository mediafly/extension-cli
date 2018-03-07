var async = require('async-kit')
var bonjour = require('bonjour')()
var _ = require('lodash')

function publish(hostname, port, mcode, slug) {

	hostname = hostname.replace('.lan', '.local')

	bonjour.publish({
		host: hostname,
		name: 'mfly-interactive server: ' + require('random-words')(3).join(' '),
		type: 'https',
		port,
		txt: {
			mcode,
			slug
		}
	})
}

process.on('asyncExit', (code, timeout, callback) => {
	if (_.includes(process.argv, 'serve')) {
		console.log('Exiting extension-cli')
		bonjour.unpublishAll(() => {
			bonjour.destroy()
			callback()
		})
	}
})

process.on('SIGINT', () => {
	async.exit(0)
})

module.exports = {
	publish
}
