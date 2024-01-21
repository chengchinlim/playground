import { Controller, Get } from "@nestjs/common";
import { ProductService } from "./product.service";
import { Public } from "../decorator/public.decorator";

@Controller("products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Public()
  @Get()
  getProductById() {
    return this.productService.getProductById(10);
  }
}
