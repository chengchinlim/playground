import { Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { ProductEntity } from "./product.entity";
import { Activities, Activity } from "nestjs-temporal";
import { ProductDTO } from "./product.dto";

@Injectable()
@Activities()
export class ProductService {
  constructor(
    @Inject("PRODUCT_REPOSITORY")
    private repo: Repository<ProductEntity>,
  ) {}

  @Activity()
  async getProductById(id: number): Promise<ProductDTO | null> {
    const product = await this.repo.findOne({
      where: {
        id,
      },
    });
    if (!product) {
      return null;
    }
    return {
      ...product,
    };
  }

  async addProduct(name: string, category: string): Promise<ProductDTO> {
    const product = await this.repo.save({
      name,
      category,
    });
    return { ...product };
  }

  async updateProduct(
    id: number,
    name: string,
    category: string,
  ): Promise<void> {
    await this.repo.update({ id }, { name, category });
  }
}

export interface IGetProductByIdActivity {
  getProductById: (id: number) => Promise<ProductEntity | null>;
}
