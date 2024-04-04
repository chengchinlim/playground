import { TestUtil } from "./util";
import { DataHelper } from "./data.helper";
import { ProductService } from "../product/product.service";

describe("Product", () => {
  jest.setTimeout(20000);

  let testUtil: TestUtil;
  let dataHelper: DataHelper;

  beforeAll(async () => {
    testUtil = new TestUtil();
    await testUtil.setupEnv();
    dataHelper = new DataHelper(testUtil.dataSource);
  });

  beforeEach(async () => {
    await testUtil.clearDbData();
  });

  it("Should get product", async () => {
    const product = await dataHelper.addProduct();
    const productService = testUtil.app.get(ProductService);
    const result = await productService.getProductById(product.id);
    expect(result?.id).toBe(product.id);
    expect(result?.name).toBe(product.name);
  });

  afterAll(async () => {
    await testUtil.destroyEnv();
  });
});
