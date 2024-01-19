import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggingService } from './logging.service';

const BODY_KEYS_TO_OMIT = ['token'];
const PATHS_TO_OMIT = ['/'];
const PATHS_IGNORE_PRINTING_BODY: string[] = [];

function getMemory(memoryObject?: NodeJS.MemoryUsage) {
  memoryObject = memoryObject || process.memoryUsage();
  return Object.entries(memoryObject).reduce((carry, [key, value]) => {
    return `${carry}${key}:${value}; `;
  }, '');
}

function processMemoryInMb() {
  const memoryObject = process.memoryUsage();
  const memoryObjectInMb: any = {};

  Object.entries(memoryObject).forEach(([key, value]) => {
    memoryObjectInMb[key] = Math.round((value / 1024 / 1024) * 100) / 100;
  });

  return memoryObjectInMb as NodeJS.MemoryUsage;
}

function calculateMemoryDiff(
  startMemory: NodeJS.MemoryUsage,
  endMemory: NodeJS.MemoryUsage,
) {
  return {
    rss: Math.round(endMemory.rss - startMemory.rss),
    heapTotal: Math.round(endMemory.heapTotal - startMemory.heapTotal),
    heapUsed: Math.round(endMemory.heapUsed - startMemory.heapUsed),
    external: Math.round(endMemory.external - startMemory.external),
    arrayBuffers: Math.round(endMemory.arrayBuffers - startMemory.arrayBuffers),
  };
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly loggingService: LoggingService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    if (PATHS_TO_OMIT.includes(request.url)) {
      return next.handle();
    }
    const cleanedBody = this.cleanBody(request.body);
    const path = `${request.method} ${request.url}`;
    const ip = request.ip;
    const userAgent = request.headers['user-agent'];
    if (!PATHS_IGNORE_PRINTING_BODY.includes(request.url)) {
      this.loggingService.logRequest('Start', {
        body: cleanedBody,
        ip,
        userAgent,
        path,
      });
    }
    const start = Date.now();
    const startMemory = processMemoryInMb();

    return next.handle().pipe(
      tap(() => {
        try {
          const end = Date.now();
          const timeTaken = end - start;

          const endMemory = processMemoryInMb();
          const diff: NodeJS.MemoryUsage = calculateMemoryDiff(
            startMemory,
            endMemory,
          );

          let note = '';
          const HIGH_MEMORY_USAGE_THRESHOLD = 200;
          if (diff.rss > HIGH_MEMORY_USAGE_THRESHOLD) {
            note = 'HIGH-MEMORY-USAGE';
          }

          this.loggingService.logRequest('End', {
            userAgent,
            ip,
            path,
            code: context.switchToHttp().getResponse().statusCode,
            timeTaken: `${timeTaken}ms`,
            memoryStart: getMemory(startMemory),
            memoryEnd: getMemory(endMemory),
            memoryDiff: getMemory(diff),
            note,
          });
        } catch (error) {
          this.loggingService.logError(error as Error);
        }
      }),
    );
  }

  cleanBody(body: any): unknown {
    try {
      if (!body) return null;
      const clonedBody = { ...body };
      BODY_KEYS_TO_OMIT.forEach((key) => {
        delete clonedBody[key];
      });
      return clonedBody;
    } catch (e) {
      return body;
    }
  }
}
