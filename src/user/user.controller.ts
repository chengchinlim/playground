import { Body, Controller, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { Public } from "../decorator/public.decorator";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post("register")
  async registerUser(
    @Body("username") username: string,
    @Body("password") password: string,
  ) {
    return this.userService.createUser(username, password);
  }

  @Public()
  @Post("login")
  async login(
    @Body("username") username: string,
    @Body("password") password: string,
  ) {
    return this.userService.login(username, password);
  }

  /* Real implementation should require an email in the body parameters
   * so the server can send the reset link to their email
   * */
  @Public()
  @Post("/password-reset/init")
  async initPasswordReset(@Body("username") username: string) {
    return this.userService.generateResetPasswordToken(username);
  }

  @Post("/password-reset")
  async resetPassword(
    @Body("username") username: string,
    @Body("newPassword") newPassword: string,
  ) {
    return this.userService.update(username, newPassword);
  }
}
