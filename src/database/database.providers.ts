import { DataSource } from "typeorm";
import { ConfigService } from "@nestjs/config";

export const databaseProviders = [
  {
    provide: "DATA_SOURCE",
    useFactory: async (configService: ConfigService) => {
      const dataSource = new DataSource({
        type: "postgres",
        host: configService.get<string>("POSTGRES_DB_HOST", "localhost"),
        port: configService.get<number>("POSTGRES_DB_PORT", 5432),
        username: configService.get<string>("POSTGRES_DB_USERNAME", "root"),
        password: configService.get<string>("POSTGRES_DB_PASSWORD", "root"),
        database: configService.get<string>("POSTGRES_DB_NAME", "test"),
        entities: [__dirname + "/../**/*.entity{.ts,.js}"],
        synchronize: configService.get<string>("POSTGRES_DB_SYNC", "0") === "1",
      });
      return dataSource.initialize();
    },
    inject: [ConfigService], // Add this line to inject the ConfigService
  },
];
