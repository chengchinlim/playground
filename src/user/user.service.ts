import { Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { UserEntity } from "./user.entity";
import * as bcrypt from "bcrypt";
import { ConfigService } from "@nestjs/config";
import jwt from "jsonwebtoken";

@Injectable()
export class UserService {
  constructor(
    @Inject("USER_REPOSITORY")
    private repo: Repository<UserEntity>,
    private readonly configService: ConfigService,
  ) {}

  async createUser(username: string, password: string) {
    const passwordHash = await bcrypt.hash(password, 10);
    await this.repo.save({
      username,
      password: passwordHash,
    });
  }

  async login(username: string, password: string) {
    const user = await this.repo.findOneOrFail({
      where: { username },
    });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new Error("Invalid email or password");
    }

    const payload = {
      username: user.username,
      password: user.password,
    };
    return jwt.sign(payload, this.configService.get("JWT_SECRET") as string);
  }
}
