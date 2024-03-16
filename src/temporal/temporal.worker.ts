import { Worker } from "@temporalio/worker";
import { productTaskQueue, temporalNamespace } from "./temporal.constant";
import * as activities from "./temporal.activities";

async function bootstrap() {
  const worker = await Worker.create({
    workflowsPath: require.resolve("./temporal.workflows"),
    activities,
    namespace: temporalNamespace,
    taskQueue: productTaskQueue,
  });

  await worker.run();
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
