import { ProductService } from "../product/product.service";

export const activity = ProductService.prototype.getProductById;

module.exports = {
  activity,
};
