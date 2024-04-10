import { Global, Module } from "@nestjs/common";
import { AsyncLocalStorage } from "node:async_hooks";
import { RequestContextService } from "./request.context.service";

@Global()
@Module({
  providers: [
    {
      provide: AsyncLocalStorage,
      useValue: new AsyncLocalStorage(),
    },
    RequestContextService,
  ],
  exports: [AsyncLocalStorage, RequestContextService],
})
export class RequestContextModule {}
