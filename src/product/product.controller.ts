import { Controller, Get, Post } from "@nestjs/common";
import { ProductService } from "./product.service";
import { InjectTemporalClient } from "nestjs-temporal";
import { WorkflowClient } from "@temporalio/client";
import { productTaskQueue } from "../temporal/temporal.constant";
import { execProductWorkFlow } from "./product.workflow";
import { Public } from "../decorator/public.decorator";

@Controller("products")
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    // @InjectTemporalClient() private readonly temporalClient: WorkflowClient,
  ) {}

  @Get()
  getProductById() {
    return this.productService.getProductById(10);
  }

  // @Public()
  // @Post("workflow")
  // async workflow() {
  //   const id = 10;
  //   const handle = await this.temporalClient.start(execProductWorkFlow, {
  //     args: [id],
  //     taskQueue: productTaskQueue,
  //     workflowId: "product-workflow-" + Math.random().toString(36).slice(2, 7),
  //   });
  //   return handle.workflowId;
  // }
}
