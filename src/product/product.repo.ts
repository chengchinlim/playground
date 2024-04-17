import { Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { ProductEntity } from "./product.entity";

@Injectable()
export class ProductRepo {
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

  async addProduct(name: string, category: string) {
    return this.repo.save({
      name,
      category,
    });
  }

  async updateProduct(id: number, name: string, category: string) {
    return this.repo.update({ id }, { name, category });
  }

  async deleteProduct(id: number) {
    return this.repo.delete({ id });
  }
}
