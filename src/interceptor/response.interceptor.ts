import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Request } from "express";
import { nanoid } from "nanoid";
import { Observable, map } from "rxjs";

interface ResponseData {
  items: unknown[];
  totalCount: number;
  extra?: unknown;
  pageSize?: number;
  pageNumber?: number;
}

/**
 * Unified processing of return values and encapsulation of data objects
 */
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();

    const result = {
      code: 200,
      message: "success",
    };

    const key = req.path + "#" + nanoid(4);
    console.time(key);

    return next.handle().pipe(
      map((data) => {
        console.timeEnd(key);
        if (!Array.isArray(data)) {
          return {
            ...result,
            data,
          };
        }

        const [list, count, extra] = data;
        let formattedData: ResponseData;
        if (Array.isArray(list) && Number.isInteger(count)) {
          formattedData = {
            items: data[0],
            pageSize: Number(req.query.pageSize) || 0,
            pageNumber: Number(req.query.pageNumber) || 0,
            totalCount: data[1],
            extra,
          };
        } else {
          formattedData = {
            items: data,
            totalCount: data.length,
          };
        }

        return {
          ...result,
          data: formattedData,
        };
      }),
    );
  }
}
