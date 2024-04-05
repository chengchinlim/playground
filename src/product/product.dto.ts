import { BaseType } from "../type";
import { IsString } from "class-validator";

export class CreateProductDTO extends BaseType {
  @IsString()
  name: string;

  @IsString()
  category: string;
}

export class ProductDTO extends BaseType {
  name: string;
  category: string;
}
