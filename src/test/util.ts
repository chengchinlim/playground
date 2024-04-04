import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, Logger } from "@nestjs/common";
import { DataSource } from "typeorm";
import * as process from "process";
import { ConfigsModule } from "../config/config.module";
import { LoggingModule } from "../logging/logging.module";
import { RequestContextModule } from "../logging/request.context.module";
import { AuthModule } from "../auth/auth.module";
import { DefaultModule } from "../default/default.module";
import { DatabaseModule } from "../database/database.module";
import { ProductModule } from "../product/product.module";
import { UserModule } from "../user/user.module";
import { TemporalMockModule } from "./temporal.mock";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "../auth/jwt.auth.guard";

export class TestUtil {
  public app: INestApplication;
  public dataSource: DataSource;
  private postgresqlContainer: StartedPostgreSqlContainer;

  constructor() {}

  async setupEnv() {
    this.postgresqlContainer = await new PostgreSqlContainer().start();
    process.env.POSTGRES_DB_HOST = this.postgresqlContainer.getHost();
    process.env.POSTGRES_DB_USERNAME = this.postgresqlContainer.getUsername();
    process.env.POSTGRES_DB_PASSWORD = this.postgresqlContainer.getPassword();
    process.env.POSTGRES_DB_NAME = this.postgresqlContainer.getDatabase();
    process.env.POSTGRES_DB_PORT = this.postgresqlContainer
      .getPort()
      .toString();
    process.env.POSTGRES_DB_SYNC = "1";

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigsModule,
        LoggingModule,
        RequestContextModule,
        AuthModule,
        DefaultModule,
        DatabaseModule,
        ProductModule,
        UserModule,
        TemporalMockModule,
      ],
      providers: [
        {
          provide: APP_GUARD,
          useClass: JwtAuthGuard,
        },
      ],
    })
      .setLogger(new Logger())
      .compile();

    this.app = moduleFixture.createNestApplication();
    await this.app.init();
    this.dataSource = moduleFixture.get<DataSource>("DATA_SOURCE");
  }

  async destroyEnv(): Promise<void> {
    await Promise.all([this.app.close(), this.postgresqlContainer.stop()]);
  }

  async clearDbData() {
    const rawQuery = `
DO
$do$
DECLARE
    _tbl text;
    _sql text;
BEGIN
    -- Construct the TRUNCATE command for all tables in the 'public' schema
    SELECT INTO _sql
           string_agg(format('TRUNCATE TABLE %I.%I CASCADE', table_schema, table_name), '; ')
    FROM   information_schema.tables
    WHERE  table_schema = 'public'
    AND    table_type = 'BASE TABLE';

    -- Check if _sql is NULL
    IF _sql IS NOT NULL THEN
        -- Execute the TRUNCATE command
        EXECUTE _sql;
    ELSE
        -- Handle the case where no tables match the criteria
    END IF;
END
$do$;
`;

    await this.dataSource.query(rawQuery);
  }
}
