import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1747770998744 implements MigrationInterface {
  name = 'Migration1747770998744';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "player" ADD "volume" integer NOT NULL DEFAULT '100'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "player" DROP COLUMN "volume"`);
  }
}
