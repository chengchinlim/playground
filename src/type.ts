import { ApiProperty } from "@nestjs/swagger";

export class BaseDTO {
  @ApiProperty()
  id: number;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}
