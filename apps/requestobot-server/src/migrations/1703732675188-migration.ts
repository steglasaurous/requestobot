import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1703732675188 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO game ("name", "displayName", "twitchCategoryId", "setGameName") VALUES ('pistol_whip', 'Pistol Whip', '514564', 'pistol whip')`,
    );

    // Add Pistol Whip OSTs here.
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM game WHERE "name" = 'pistol_whip'`);
  }
}
