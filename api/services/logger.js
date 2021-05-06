import appRoot from 'app-root-path';
import winston from 'winston';
import 'winston-daily-rotate-file';

const dateTimeOptions = { 
  dateStyle: "short",
  timeStyle: "long",
  timeZone: "America/New_York"
};
const dateTimeFormatter = new Intl.DateTimeFormat('en-US', dateTimeOptions)

// define the custom settings for each transport (file, console)
const fileOptions = {
  file: {
    level: 'info',
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false
  },
  rotateFile: {
    level: 'info',
    filename: "app.log",
    dirname: `${appRoot}/logs`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
    datePattern: 'yyyy-MM-DD',
    prepend: true
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

// instantiate a new Winston Logger with the settings defined above
let logger;
if (process.env.logging === 'off') {
  logger = winston.createLogger({
    transports: [
      new winston.transports.File(fileOptions.file),
    ],
    exitOnError: false, // do not exit on handled exceptions
  });
} else {
  logger = winston.createLogger({
    transports: [
      //new winston.transports.File(options.file),
      new (winston.transports.DailyRotateFile)(fileOptions.rotateFile),
      new (winston.transports.Console)(fileOptions.console),
    ],
    exitOnError: false, // do not exit on handled exceptions
  });
}

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write(message) {
    logger.info(message);
  },
};

export default logger;
export {
  dateTimeFormatter
}