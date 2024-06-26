import { Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { getBodyParserOptions } from "@nestjs/platform-express/adapters/utils/get-body-parser-options.util";
import { json } from "express";
import { WinstonModule, utilities } from "nest-winston";
import { AsyncLocalStorage } from "node:async_hooks";
import * as sourceMapSupport from "source-map-support";
import * as winston from "winston";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./exception/any.exception.filter";
import { ResponseInterceptor } from "./interceptor/response.interceptor";
import { LoggingService } from "./logging/logging.service";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { RequestContextFields } from "./logging/request.context.service";
// to map JS stack traces to TS source code
sourceMapSupport.install();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { origin: "*" },
    bodyParser: false,
  });
  /* custom body parser options are used for accessing rawBody of request
   * rawBody is required to validate Shopify webhooks
   * https://github.com/nestjs/nest/issues/10471#issuecomment-1304589556
   * */
  app.use(json(getBodyParserOptions(true, { limit: "20mb" })));
  app.useLogger(
    WinstonModule.createLogger({
      format: winston.format.uncolorize(),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            utilities.format.nestLike(),
          ),
        }),
      ],
    }),
  );
  const loggingService = new LoggingService(
    new AsyncLocalStorage<RequestContextFields>(),
  );
  /* Not using global logging interceptor
   * because it does not print requestId and userId
   *
   * This happens because async local storage is initialized
   * after global interceptors
   *
   * Currently each controller needs to add useInterceptors(LoggingRequestInterceptor)
   * */
  // app.useGlobalInterceptors(new LoggingInterceptor(loggingService));

  /* Could not use dependency injection
   * because Nest does not have global scope
   * https://github.com/nestjs/nest/issues/244
   * */
  app.useGlobalFilters(new AllExceptionsFilter(loggingService));
  app.useGlobalInterceptors(new ResponseInterceptor());
  const configService = app.get(ConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle("Playground API")
    .setDescription("Basic CRUD API for Playground")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("doc", app, document);

  const port = process.env.PORT || configService.get<string>("PORT");
  await app.listen(port!);
  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap()
  .then(() => {
    console.log("Bootstrap success");
  })
  .catch(() => {
    console.log("Bootstrap failed");
  });
