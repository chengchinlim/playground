import { Module } from "@nestjs/common";
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

export interface RequestContextFields {
  requestId: string;
  userId?: string;
  phoneNumber?: string;
}

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
    /* Comment out temporal module
     * because it requires a server which only works on localhost.
     * */
    // TemporalModule.registerWorker({
    //   workerOptions: {
    //     taskQueue: productTaskQueue,
    //     workflowsPath: require.resolve("./product/product.workflow"),
    //   },
    // }),
    // TemporalModule.registerClient(),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {
  constructor() {}
}
