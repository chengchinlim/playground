import { Controller, Get, Post } from "@nestjs/common";
import { ProductService } from "./product.service";
import { TemporalService } from "../temporal/temporal.service";
import { productTaskQueue } from "../temporal/temporal.constant";

@Controller("products")
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private temporalService: TemporalService,
  ) {}

  @Get()
  getProductById() {
    return this.productService.getProductById(10);
  }

  @Post("workflow")
  async execProductWorkFlow() {
    const temporalClient = await this.temporalService.getClient();
    const id = 10;
    const handle = await temporalClient.start(
      this.productService.execProductWorkFlow,
      {
        args: [id],
        taskQueue: productTaskQueue,
        workflowId:
          "product-workflow-" + Math.random().toString(36).slice(2, 7),
      },
    );
    return handle.workflowId;
  }
}
