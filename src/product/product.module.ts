import { Global, Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { productProviders } from "./product.provider";

/* Only need to load once
 * it is loaded in app.module.ts
 * */
@Global()
@Module({
  controllers: [ProductController],
  providers: [ProductService, ...productProviders],
  exports: [ProductService],
})
export class ProductModule {}
