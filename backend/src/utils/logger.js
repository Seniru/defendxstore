require("dotenv").config()

const winston = require("winston")

const logLevelLabels = {
    info: "\x1b[1;44;37m info \x1b[0m",
    debug: "\x1b[1;100;37m debug \x1b[0m",
    warn: "\x1b[1;43;37m warn \x1b[0m",
    error: "\x1b[1;41;37m err! \x1b[0m",
}

const customFormat = winston.format.printf(({ level, message, timestamp }) => {
    return `\x1b[100m ${timestamp} \x1b[0m${logLevelLabels[level]} | ${message}`
})

const logger = winston.createLogger({
    level: "info",
    transports: [
        new winston.transports.File({
            filename: "logs/error.log",
            level: "error",
        }),
        new winston.transports.Console({
            level: { production: "info", dev: "debug", test: "error" }[process.env.NODE_ENV],
            format: winston.format.combine(winston.format.timestamp(), customFormat),
        }),
    ],
})

module.exports = logger
