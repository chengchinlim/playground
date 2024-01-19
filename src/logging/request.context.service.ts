import { Injectable } from "@nestjs/common";
import { AsyncLocalStorage } from "node:async_hooks";
import { RequestContextFields } from "../app.module";

@Injectable()
export class RequestContextService {
  constructor(
    private readonly requestContextStorage: AsyncLocalStorage<RequestContextFields>,
  ) {}

  isLogin(): boolean {
    return !!this.requestContextStorage.getStore()!.userId;
  }
}
