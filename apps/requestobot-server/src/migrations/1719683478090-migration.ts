import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1719683478090 implements MigrationInterface {
  name = 'Migration1719683478090';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "song" ADD "createdOn" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "song" ADD "updatedOn" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    // FIXME: Find correct twitch category id and add it here.
    await queryRunner.query(
      `INSERT INTO game ("name", "displayName", "twitchCategoryId", "setGameName") VALUES ('synth_riders', 'Synth Riders', '0', 'synth_riders')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "song" DROP COLUMN "updatedOn"`);
    await queryRunner.query(`ALTER TABLE "song" DROP COLUMN "createdOn"`);
    await queryRunner.query(`DELETE FROM "game" WHERE "name" = 'synth_riders'`);
  }
}
