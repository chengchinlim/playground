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
import { CreateProductDTO, ProductDTO, UpdateProductDTO } from "./product.dto";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { LoggingService } from "../logging/logging.service";

@ApiTags("Products")
@Controller("products")
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    @InjectTemporalClient()
    private readonly temporalClient: WorkflowClient,
    private readonly loggingService: LoggingService,
  ) {}

  @Post()
  @ApiOkResponse({
    type: ProductDTO,
    description: "Successfully created product",
  })
  createProduct(@Body() createProductDTO: CreateProductDTO) {
    return this.productService.addProduct(
      createProductDTO.name,
      createProductDTO.category,
    );
  }

  @Get("/:id")
  @ApiOkResponse({
    type: ProductDTO,
    description: "Successfully retrieved product",
  })
  getProductById(@Param("id") id: number) {
    this.loggingService.logMessage(`Retrieving product ${id}...`);
    return this.productService.getProductById(id);
  }

  @Put("/:id")
  @ApiOkResponse({
    description: "Successfully updated product",
  })
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
  @ApiOkResponse({
    description: "Successfully deleted product",
  })
  deleteProductById(@Param("id") id: number) {
    return this.productService.deleteProduct(id);
  }

  @Public()
  @Post("workflow")
  @ApiOkResponse({
    description: "Launch temporal io workflow",
  })
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
