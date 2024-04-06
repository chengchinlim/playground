import { Body, Controller, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { Public } from "../decorator/public.decorator";
import { CreateUserDTO } from "./user.dto";
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
}
