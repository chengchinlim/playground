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

  it("Add & get product", async () => {
    const productService = testUtil.app.get(ProductService);
    const product = await productService.addProduct("Product 1", "Category 1");
    const result = await productService.getProductById(product.id);
    expect(result).toBeDefined();
    expect(result!.id).toBe(product.id);
    expect(result!.name).toBe(product.name);
  });

  afterAll(async () => {
    await testUtil.destroyEnv();
  });
});
