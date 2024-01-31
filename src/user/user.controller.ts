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
}
