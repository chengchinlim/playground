import { TestUtil } from "./util";
import { ProductService } from "../product/product.service";

describe("Product", () => {
  jest.setTimeout(20000);

  let testUtil: TestUtil;

  beforeAll(async () => {
    testUtil = new TestUtil();
    await testUtil.setupEnv();
  });

  beforeEach(async () => {
    await testUtil.clearDbData();
  });

  it("CRUD", async () => {
    const productService = testUtil.app.get(ProductService);
    const product = await productService.addProduct("Product 1", "Category 1");
    let result = await productService.getProductById(product.id);
    expect(result).toBeDefined();
    expect(result!.id).toBe(product.id);
    expect(result!.name).toBe("Product 1");

    await productService.updateProduct(product.id, "Product 1", "Category 2");
    result = await productService.getProductById(product.id);
    expect(result!.category).toBe("Category 2");
  });

  afterAll(async () => {
    await testUtil.destroyEnv();
  });
});
