var winston = require('winston')
var path = require('path')
var fs = require('fs')

var logPath = path.join(process.cwd(), 'logs')
var logFilePath = path.join(logPath, 'all.log')

// Winston will not create log files due to this bug:
// https://github.com/winstonjs/winston/issues/875
var dirExists = fs.existsSync(logPath);

if (!dirExists) {
	fs.mkdirSync(logPath)
}

var logExists = fs.existsSync(logFilePath)

if (!logExists) {
	fs.writeFileSync(logFilePath, '')
}

winston
	.remove(winston.transports.Console)
	.add(winston.transports.File, {
		level: 'silly',
		filename: logFilePath,
		maxSize: 10000000,
		json: false,
		colorize: true
	})
	.add(winston.transports.Console, {
		level: 'silly',
		json: false,
		colorize: true
	})
