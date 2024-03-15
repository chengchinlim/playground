import { Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { ProductEntity } from "./product.entity";
import { proxyActivities } from "@temporalio/workflow";

@Injectable()
export class ProductService {
  constructor(
    @Inject("PRODUCT_REPOSITORY")
    private repo: Repository<ProductEntity>,
  ) {}

  async execProductWorkFlow(id: number) {
    console.log(id);
    const { getProductById } = proxyActivities<ProductService>({
      // RetryPolicy specifies how to automatically handle retries if an Activity fails.
      retry: {
        initialInterval: "1 second",
        maximumInterval: "1 minute",
        backoffCoefficient: 2,
        maximumAttempts: 3,
      },
      startToCloseTimeout: "1 minute",
    });
    const product = await getProductById(id);
    console.log(product);
    return product;
  }

  async getProductById(id: number) {
    return this.repo.findOne({
      where: {
        id,
      },
    });
  }
}
