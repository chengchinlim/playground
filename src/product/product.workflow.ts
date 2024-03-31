import { proxyActivities } from "@temporalio/workflow";
import { IGetProductByIdActivity } from "./product.service";

const { getProductById } = proxyActivities<IGetProductByIdActivity>({
  // RetryPolicy specifies how to automatically handle retries if an Activity fails.
  retry: {
    initialInterval: "1 second",
    maximumInterval: "1 minute",
    backoffCoefficient: 2,
    maximumAttempts: 3,
  },
  startToCloseTimeout: "1 minute",
});

async function execProductWorkFlow(id: number) {
  console.log(id);
  const product = await getProductById(id);
  console.log(product);
  return product;
}

export { execProductWorkFlow };
