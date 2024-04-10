import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigsModule } from "./config/config.module";
import { LoggingModule } from "./logging/logging.module";
import { RequestContextModule } from "./logging/request.context.module";
import { AuthModule } from "./auth/auth.module";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./auth/jwt.auth.guard";
import { DefaultModule } from "./default/default.module";
import { DatabaseModule } from "./database/database.module";
import { ProductModule } from "./product/product.module";
import { UserModule } from "./user/user.module";
import { TemporalModule } from "nestjs-temporal";
import { productTaskQueue } from "./temporal/temporal.constant";
import { TemporalMockModule } from "./test/temporal.mock";
import { AsyncLocalStorage } from "node:async_hooks";
import { RequestContextFields } from "./logging/request.context.service";
import { NextFunction } from "express";
import { v4 as uuid } from "uuid";

@Module({
  imports: [
    ConfigsModule,
    LoggingModule,
    RequestContextModule,
    AuthModule,
    DefaultModule,
    DatabaseModule,
    ProductModule,
    UserModule,
    process.env.USE_TEMPORAL_MOCK === "1"
      ? TemporalMockModule
      : TemporalModule.registerWorker({
          workerOptions: {
            taskQueue: productTaskQueue,
            workflowsPath: require.resolve("./product/product.workflow"),
          },
        }),
    process.env.USE_TEMPORAL_MOCK === "1"
      ? TemporalMockModule
      : TemporalModule.registerClient(),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  constructor(
    private readonly requestContextStorage: AsyncLocalStorage<RequestContextFields>,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req: Request, res: Response, next: NextFunction) => {
        const store: RequestContextFields = {
          requestId: uuid(),
        };
        this.requestContextStorage.run(store, () => next());
      })
      .forRoutes("*");
  }
}
