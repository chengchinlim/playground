import { Global, Module } from "@nestjs/common";
import { databaseProviders } from "./database.provider";

/* Only need to load once
 * it is loaded in app.module.ts
 * */
@Global()
@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
