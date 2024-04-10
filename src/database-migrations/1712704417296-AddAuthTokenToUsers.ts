import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAuthTokenToUsers1712704417296 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users"
                ADD "auth_token" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "auth_token"`);
  }
}
