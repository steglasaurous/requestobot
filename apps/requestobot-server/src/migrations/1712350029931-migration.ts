import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1712350029931 implements MigrationInterface {
  name = 'Migration1712350029931';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "song" ADD "coverArtUrl" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "song" DROP COLUMN "coverArtUrl"`);
  }
}
