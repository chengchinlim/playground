import { Global, Module } from '@nestjs/common';
import { LoggingService } from './logging.service';

/* Only need to load once
 * it is loaded in app.module.ts
 * */
@Global()
@Module({
  providers: [LoggingService],
  exports: [LoggingService],
})
export class LoggingModule {}
