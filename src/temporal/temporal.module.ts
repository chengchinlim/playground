import { Global, Module } from "@nestjs/common";
import { TemporalService } from "./temporal.service";

/* Only need to load once
 * it is loaded in app.module.ts
 * */
@Global()
@Module({
  providers: [TemporalService],
  exports: [TemporalService],
})
export class TemporalModule {}
