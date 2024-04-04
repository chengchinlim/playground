import { DataSource } from "typeorm";
import { ConfigService } from "@nestjs/config";

export const databaseProviderMock = [
  {
    provide: "DATA_SOURCE",
    useFactory: async (configService: ConfigService) => {
      const dataSource = new DataSource({
        type: "sqlite",
        database: ":memory:",
        entities: [__dirname + "/../**/*.entity{.ts,.js}"],
        synchronize: true,
      });
      return dataSource.initialize();
    },
    inject: [ConfigService], // Add this line to inject the ConfigService
  },
];
