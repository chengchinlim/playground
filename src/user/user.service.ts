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

  async validateUser(id: number, username: string) {
    return this.repo.findOneOrFail({
      where: { id, username },
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
      id: user.id,
      username: user.username,
      password: user.password,
    };
    const token = jwt.sign(
      payload,
      this.configService.get("JWT_SECRET") as string,
    );
    await this.repo.update(user.id, { authToken: token });
    return token;
  }

  async generateResetPasswordToken(username: string) {
    const user = await this.repo.findOneOrFail({
      where: { username },
    });
    return jwt.sign(
      { username: user.username },
      this.configService.get("JWT_SECRET") as string,
      {
        expiresIn: "1h", // expires in 1 hour
      },
    );
  }

  async update(username: string, password: string) {
    const passwordHash = await bcrypt.hash(password, 10);
    await this.repo.update(
      {
        username,
      },
      {
        password: passwordHash,
      },
    );
  }
}
