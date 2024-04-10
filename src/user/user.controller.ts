import { Body, Controller, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { Public } from "../decorator/public.decorator";
import {
  CreateUserDTO,
  PasswordResetInitDTO,
  ResetPasswordDTO,
} from "./user.dto";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("Users")
@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post("register")
  @ApiOkResponse({
    description: "Successfully register user",
  })
  async registerUser(@Body() createUserDTO: CreateUserDTO) {
    return this.userService.createUser(
      createUserDTO.username,
      createUserDTO.password,
    );
  }

  @Public()
  @Post("login")
  @ApiOkResponse({
    type: String,
    description: "Successfully login user, token returned",
  })
  async login(@Body() createUserDTO: CreateUserDTO) {
    return this.userService.login(
      createUserDTO.username,
      createUserDTO.password,
    );
  }

  /* Real implementation should require an email in the body parameters
   * so the server can send the reset link to their email
   * */
  @Public()
  @Post("/password-reset/init")
  async initPasswordReset(@Body() passwordResetInitDTO: PasswordResetInitDTO) {
    return this.userService.generateResetPasswordToken(
      passwordResetInitDTO.username,
    );
  }

  @Post("/password-reset")
  async resetPassword(@Body() updateUserDTO: ResetPasswordDTO) {
    return this.userService.update(
      updateUserDTO.username,
      updateUserDTO.newPassword,
    );
  }
}
