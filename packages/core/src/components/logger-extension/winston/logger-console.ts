﻿// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {createLogger, transports, format} from 'winston';
import {LOGGER} from '../keys';
import {WinstonLoggerBase} from './logger-base';
import {TransformableInfo} from 'logform';

/**
 * Defining the structure of the log entry.
 * Creating an interface `LogEntry` which
 * extends `TransformableInfo`.
 */
interface LogEntry extends TransformableInfo {
  level: string;
  message: string;
  timestamp?: Date;
}

/* Creating a new Winston logger instance and setting the format to be used. */
export class WinstonConsoleLogger extends WinstonLoggerBase {
  constructor() {
    super();
    const logFormat = format.combine(
      format.uncolorize(),
      format.timestamp(),
      format.printf(
        (log: LogEntry) => `[${log.timestamp}] ${log.level} :: ${log.message}`,
      ),
    );

    this.logger = createLogger({
      transports: [new transports.Console()],
      format: logFormat,
      level:
        process.env.LOG_LEVEL ??
        LOGGER.LOG_LEVEL[LOGGER.LOG_LEVEL.ERROR].toLowerCase(),
    });
  }
}
