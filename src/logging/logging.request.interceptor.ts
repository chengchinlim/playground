import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { LoggingService } from './logging.service';

const BODY_KEYS_TO_OMIT = ['token'];
const PATHS_TO_OMIT = ['/'];
const PATHS_IGNORE_PRINTING_BODY: string[] = [];

@Injectable()
export class LoggingRequestInterceptor implements NestInterceptor {
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
    return next.handle();
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
