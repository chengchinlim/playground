import { Global, Module } from "@nestjs/common";
import { databaseProviders } from "./database.providers";
import { databaseProviderMock } from "./database.providers.mock";

/* Only need to load once
 * it is loaded in app.module.ts
 * */
@Global()
@Module({
  providers:
    process.env.USE_DATABASE_MOCK === "1"
      ? [...databaseProviderMock]
      : [...databaseProviders],
  exports:
    process.env.USE_DATABASE_MOCK === "1"
      ? [...databaseProviderMock]
      : [...databaseProviders],
})
export class DatabaseModule {}
