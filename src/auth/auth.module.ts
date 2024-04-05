import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./jwt.strategy";

@Module({
  providers: [JwtStrategy],
  imports: [
    // This is how we register the JwtModule along with it's configurations.
    // Read more: https://docs.nestjs.com/recipes/passport#implementing-passport-jwt
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get("JWT_SECRET"),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AuthModule {}
