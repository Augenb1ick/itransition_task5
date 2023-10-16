const winston = require('winston');
const expressWinston = require('express-winston');

const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({
      filename: 'request.log',
      json: true,
    }),
  ],
});

const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({
      filename: 'error.log',
      json: true,
    }),
  ],
});

module.exports = {
  requestLogger,
  errorLogger,
};
