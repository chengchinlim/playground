import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config(
  process.env.NODE_ENV === "local"
    ? { path: `${process.cwd()}/.env.local` }
    : {},
);

const dataSourceForMigration = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_DB_HOST || "localhost",
  port: parseInt(process.env.POSTGRES_DB_PORT as string, 10) || 5432,
  username: process.env.POSTGRES_DB_USERNAME || "your_username",
  password: process.env.POSTGRES_DB_PASSWORD || "your_password",
  database: process.env.POSTGRES_DB_NAME || "your_database",
  entities: ["./**/*.entity{.ts,.js}"],
  synchronize: false,
  migrations: ["./src/database-migrations/**/*{.ts,.js}"],
});

export default dataSourceForMigration;
