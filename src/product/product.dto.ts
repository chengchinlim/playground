import { BaseType } from "../type";
import { IsString } from "class-validator";

export class CreateProductDTO {
  @IsString()
  name: string;

  @IsString()
  category: string;
}

export class ProductDTO extends BaseType {
  name: string;
  category: string;
}

export class UpdateProductDTO {
  @IsString()
  name: string;

  @IsString()
  category: string;
}
