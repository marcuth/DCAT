const winston = require('winston');
const { logsDir } = require('../config');

const logger = winston.createLogger({
	level: 'info',
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.errors({ stack: true }),
		winston.format.json()
	),
	transports: [
		new winston.transports.File({ filename: `${logsDir}/error.log`, level: 'error' }),
		new winston.transports.File({ filename: `${logsDir}/combined.log` }),
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.colorize(),
				winston.format.printf(({ timestamp, level, message, ...meta }) => {
					const details = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';

					return `${timestamp} ${level}: ${message}${details}`;
				})
			)
		})
	]
});

module.exports = logger;
