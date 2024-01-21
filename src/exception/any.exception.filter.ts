import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { LoggingService } from "../logging/logging.service";
import { CustomException } from "./custom.exception";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly loggingService: LoggingService) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    // const request = ctx.getRequest();
    // Don't remove the exception logging below, since we need exceptions to show in our logs
    // for production debugging.
    this.loggingService.logError(exception);

    let code: number, message: string, data: any;

    if (exception instanceof CustomException) {
      code = exception.code;
      message = exception.message;
      data = exception.data;
    } else if (
      // If it is an error that pops up from validate, this can give FE a clear error message.
      exception instanceof BadRequestException &&
      "response" in exception
    ) {
      const { status, response } = exception as unknown as {
        status: number;
        response: { message: string[] };
      };
      (code = status), (message = response.message.join("&"));
    } else {
      code =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception?.message;
    }

    response.status(code).json({
      code,
      data,
      message,
    });
  }
}
