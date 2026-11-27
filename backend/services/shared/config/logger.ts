import winston from 'winston';
import config from './index';

const devFormat = winston.format.printf(
  ({ timestamp, level, message, ...meta }) => {
    const extra = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `${timestamp} ${level}: ${message}${extra}`;
  },
);

const logger = winston.createLogger({
  level: config.isProduction ? 'info' : 'debug',
  silent: config.env === 'test',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    config.isProduction
      ? winston.format.json()
      : winston.format.combine(winston.format.colorize(), devFormat),
  ),
  transports: [new winston.transports.Console()],
});

export default logger;
