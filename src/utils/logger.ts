import winston from 'winston';
const { combine, timestamp, colorize, json } = winston.format;


const transports = [
    // Log to the console(transport log to console)
    new winston.transports.Console({
        format: colorize({ all: true })
    }),

]


// Define your Winston logger configuration
const Logger = winston.createLogger({

    level: 'debug', // Set the log level(this record message from this level to higher up)
    format: combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
        json()
    ),
    transports
});


export default Logger