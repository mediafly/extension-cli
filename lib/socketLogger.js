var winston = require('winston')

module.exports = function(sockets) {
	sockets.on('connection', function(socket) {
		socket.on('log', function(data) {
			switch(data.level){
				case 'error':
					winston.error(data.message, { userAgent: data.userAgent })
					break
				case 'log':
					winston.info(data.message, { userAgent: data.userAgent })
					break
				case 'assert':
					winston.warn(data.message, { userAgent: data.userAgent })
					break
			}
		})
	})
}