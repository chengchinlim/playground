import { Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { ProductEntity } from "./product.entity";

@Injectable()
export class ProductService {
  constructor(
    @Inject("PRODUCT_REPOSITORY")
    private repo: Repository<ProductEntity>,
  ) {}

  async getProductById(id: number) {
    return this.repo.findOne({
      where: {
        id,
      },
    });
  }
}

export const getProductById = ProductService.prototype.getProductById;
