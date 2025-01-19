import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1709872297346 implements MigrationInterface {
  name = 'Migration1709872297346';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "song_request" ALTER COLUMN "requestOrder" TYPE double precision`,
    );
    await queryRunner.query(
      `ALTER TABLE "song_request" DROP COLUMN "requestPriority"`,
    );
    await queryRunner.query(
      `ALTER TABLE "song_request" ADD "requestPriority" integer NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "song_request" DROP COLUMN "requestPriority"`,
    );
    await queryRunner.query(
      `ALTER TABLE "song_request" ADD "requestPriority" double precision NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "song_request" DROP COLUMN "requestOrder"`,
    );
    await queryRunner.query(
      `ALTER TABLE "song_request" ADD "requestOrder" integer NOT NULL`,
    );
  }
}
