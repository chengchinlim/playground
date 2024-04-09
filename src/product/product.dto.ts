import { BaseDTO } from "../type";
import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateProductDTO {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  category: string;
}

export class ProductDTO extends BaseDTO {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  category: string;
}

export class UpdateProductDTO {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  category: string;
}
