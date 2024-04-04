import { DataSource } from "typeorm";
import { ProductEntity } from "../product/product.entity";

export class DataHelper {
  private dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  async addProduct() {
    const productRepo = this.dataSource.getRepository(ProductEntity);
    return productRepo.save({
      name: "Product 1",
      category: "Category 1",
    });
  }
}
