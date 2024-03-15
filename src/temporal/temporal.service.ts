import { Connection, WorkflowClient } from "@temporalio/client";
import { Injectable } from "@nestjs/common";
import { temporalNamespace } from "./temporal.constant";

@Injectable()
export class TemporalService {
  constructor() {}

  // Methods to start and interact with workflows...
  async getClient() {
    const connection = await Connection.connect();
    return new WorkflowClient({ connection, namespace: temporalNamespace });
  }
}
