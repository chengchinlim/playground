import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import { AsyncLocalStorage } from 'node:async_hooks';
import { RequestContextFields } from '../app.module';

export type TJobStatus =
  | 'active'
  | 'completed'
  | 'stalled'
  | 'waiting'
  | 'removed'
  | 'cleaned';

@Injectable()
export class LoggingService {
  private errorLogger: winston.Logger;
  private infoLogger: winston.Logger;
  constructor(
    private readonly requestContextStorage: AsyncLocalStorage<RequestContextFields>,
  ) {
    const { combine, timestamp, json } = winston.format;
    this.errorLogger = winston.createLogger({
      format: combine(timestamp(), json()),
      transports: [new winston.transports.Console()],
    });
    this.infoLogger = winston.createLogger({
      format: combine(timestamp(), json()),
      transports: [new winston.transports.Console()],
    });
  }

  logError(e: Error) {
    this.errorLogger.error(e.message, {
      ...this.requestContextStorage.getStore(),
      stack: e.stack,
    });
  }

  logMessage(message: string) {
    this.infoLogger.info(message, this.requestContextStorage.getStore());
  }

  logRequest(status: 'Start' | 'End', data: unknown) {
    this.infoLogger.info(
      `Request ${status}s`,
      Object.assign({}, this.requestContextStorage.getStore(), data),
    );
  }

  logJob(status: TJobStatus, jobId: string, data: unknown) {
    this.infoLogger.info(`Bull Job ${jobId} ${status}`, {
      data,
      jobId,
    });
  }
}
