import { Injectable } from "@nestjs/common";
import { ProductEntity } from "./product.entity";
import { Activities, Activity } from "nestjs-temporal";
import { ProductDTO } from "./product.dto";
import { ProductRepo } from "./product.repo";

@Injectable()
@Activities()
export class ProductService {
  constructor(private repo: ProductRepo) {}

  @Activity()
  async getProductById(id: number): Promise<ProductDTO | null> {
    const product = await this.repo.getProductById(id);
    if (!product) {
      return null;
    }
    return {
      ...product,
    };
  }

  async addProduct(name: string, category: string): Promise<ProductDTO> {
    const product = await this.repo.addProduct(name, category);
    return { ...product };
  }

  async updateProduct(
    id: number,
    name: string,
    category: string,
  ): Promise<void> {
    await this.repo.updateProduct(id, name, category);
  }

  async deleteProduct(id: number): Promise<void> {
    await this.repo.deleteProduct(id);
  }
}

export interface IGetProductByIdActivity {
  getProductById: (id: number) => Promise<ProductEntity | null>;
}
