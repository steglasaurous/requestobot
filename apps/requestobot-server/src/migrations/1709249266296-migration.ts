import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1709249266296 implements MigrationInterface {
  name = 'Migration1709249266296';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "setting_definition" ADD "choices" text`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "setting_definition" DROP COLUMN "choices"`,
    );
  }
}
