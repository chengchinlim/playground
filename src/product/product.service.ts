import { Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { ProductEntity } from "./product.entity";
import { Activities, Activity } from "nestjs-temporal";

@Injectable()
@Activities()
export class ProductService {
  constructor(
    @Inject("PRODUCT_REPOSITORY")
    private repo: Repository<ProductEntity>,
  ) {}

  @Activity()
  async getProductById(id: number) {
    return this.repo.findOne({
      where: {
        id,
      },
    });
  }
}

export interface IGetProductByIdActivity {
  getProductById: (id: number) => Promise<ProductEntity | null>;
}
