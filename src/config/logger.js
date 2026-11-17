import fs from 'node:fs';
import path from 'node:path';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { config } from './index.js';

const logsDir = path.resolve('logs');
fs.mkdirSync(logsDir, { recursive: true });

const customLevels = {
  levels: { fatal: 0, error: 1, warning: 2, info: 3, http: 4, debug: 5 },
  colors: { fatal: 'red', error: 'red', warning: 'yellow', info: 'green', http: 'cyan', debug: 'grey' }
};
winston.addColors(customLevels.colors);

const lineFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, stack }) =>
    `${timestamp} [${level}] ${stack || message}`)
);

const transports = [
  new winston.transports.Console({
    level: config.nodeEnv === 'production' ? 'info' : config.logLevel,
    format: winston.format.combine(
      winston.format.colorize(),
      lineFormat
    )
  }),
  new DailyRotateFile({
    filename: path.join(logsDir, 'application-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxFiles: '14d',
    maxSize: '10m',
    level: 'debug',
    format: lineFormat
  }),
  new DailyRotateFile({
    filename: path.join(logsDir, 'error-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxFiles: '30d',
    maxSize: '10m',
    level: 'error',
    format: lineFormat
  })
];

const logger = winston.createLogger({
  levels: customLevels.levels,
  level: 'debug',
  transports,
  exitOnError: false
});

export default logger;
