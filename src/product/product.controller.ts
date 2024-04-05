import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { ProductService } from "./product.service";
import { InjectTemporalClient } from "nestjs-temporal";
import { WorkflowClient } from "@temporalio/client";
import { productTaskQueue } from "../temporal/temporal.constant";
import { execProductWorkFlow } from "./product.workflow";
import { Public } from "../decorator/public.decorator";
import { CreateProductDTO, UpdateProductDTO } from "./product.dto";

@Controller("products")
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    @InjectTemporalClient()
    private readonly temporalClient: WorkflowClient,
  ) {}

  @Post()
  createProduct(@Body() createProductDTO: CreateProductDTO) {
    return this.productService.addProduct(
      createProductDTO.name,
      createProductDTO.category,
    );
  }

  @Get("/:id")
  getProductById(@Param("id") id: number) {
    return this.productService.getProductById(id);
  }

  @Put("/:id")
  updateProductById(
    @Param("id") id: number,
    @Body() updateProductDTO: UpdateProductDTO,
  ) {
    return this.productService.updateProduct(
      id,
      updateProductDTO.name,
      updateProductDTO.category,
    );
  }

  @Delete("/:id")
  deleteProductById(@Param("id") id: number) {
    return this.productService.deleteProduct(id);
  }

  @Public()
  @Post("workflow")
  async workflow() {
    const id = 10;
    const handle = await this.temporalClient.start(execProductWorkFlow, {
      args: [id],
      taskQueue: productTaskQueue,
      workflowId: "product-workflow-" + Math.random().toString(36).slice(2, 7),
    });
    return handle.workflowId;
  }
}
