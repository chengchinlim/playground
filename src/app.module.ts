import { Module } from "@nestjs/common";
import { ConfigsModule } from "./config/config.module";
import { LoggingModule } from "./logging/logging.module";
import { RequestContextModule } from "./logging/request.context.module";
import { AuthModule } from "./auth/auth.module";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./auth/jwt.auth.guard";
import { DefaultModule } from "./default/default.module";

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
