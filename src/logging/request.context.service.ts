import { Injectable } from "@nestjs/common";
import { AsyncLocalStorage } from "node:async_hooks";

export interface RequestContextFields {
  requestId: string;
  id?: number;
  username?: string;
}

@Injectable()
export class RequestContextService {
  constructor(
    private readonly requestContextStorage: AsyncLocalStorage<RequestContextFields>,
  ) {}

  isLogin(): boolean {
    return !!this.requestContextStorage.getStore()!.id;
  }
}
