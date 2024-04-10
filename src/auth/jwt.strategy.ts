import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { AsyncLocalStorage } from "node:async_hooks";
import { RequestContextFields } from "../logging/request.context.service";
import { UserService } from "../user/user.service";

type TJwtPayload = {
  id: number;
  username: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private userService: UserService,
    private readonly requestContextStorage: AsyncLocalStorage<RequestContextFields>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get("JWT_SECRET"),
    });
  }

  // token already decoded by library
  async validate(payload: TJwtPayload) {
    // decoded json validation logic
    const user = await this.userService.validateUser(
      payload.id,
      payload.username,
    );
    this.requestContextStorage.getStore()!.id = user.id;
    this.requestContextStorage.getStore()!.username = user.username;
    return payload;
  }
}
