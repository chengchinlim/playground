import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDTO {
  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  password: string;
}

export class PasswordResetInitDTO {
  @ApiProperty()
  @IsString()
  username: string;
}

export class ResetPasswordDTO {
  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  newPassword: string;
}
