import { ProductService } from "../product/product.service";

export const workflow = ProductService.prototype.execProductWorkFlow;

module.exports = {
  workflow,
};
