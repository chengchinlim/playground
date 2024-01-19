import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import config from "./config";

function getEnvFilePath(): string {
  if (process.env.ON_SERVER) {
    return ".env";
  }
  return `.env.${process.env.NODE_ENV}`;
}

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: getEnvFilePath(),
      load: [config],
      isGlobal: true,
    }),
  ],
})
export class ConfigsModule {}
