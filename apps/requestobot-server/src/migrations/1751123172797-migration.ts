import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1751123172797 implements MigrationInterface {
  name = 'Migration1751123172797';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "game" ADD "enablePlayerControls" boolean NOT NULL DEFAULT false`
    );
    await queryRunner.query(
      `UPDATE "game" SET "enablePlayerControls" = true WHERE game.id = 6`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "game" DROP COLUMN "enablePlayerControls"`
    );
  }
}
