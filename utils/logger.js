const { createLogger, format, transports } = require('winston');
require('winston-mongodb');

const logConfiguration = {
    transports: [
        new transports.Console({
            level: 'warn'
        }),
        new transports.File({
            filename: 'logs/server.log',
            format:format.combine(
                format.timestamp({format: 'MMM-DD-YYYY HH:mm:ss'}),
                format.align(),
                format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
            )
        }),
        new transports.MongoDB({
            level: 'error',
            db : 'mongodb://localhost:27017/vidly_db',
            options: {
                useUnifiedTopology: true
            },
            collection: 'logs',
            format: format.combine(
                format.timestamp(),
                // Convert logs to a json format
                format.json())
        })
    ]
};

module.exports = createLogger(logConfiguration);