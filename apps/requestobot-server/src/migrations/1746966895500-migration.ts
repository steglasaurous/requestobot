import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1746966895500 implements MigrationInterface {
  transaction?: boolean;
  name = 'Migration1746966895500';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "game" ALTER COLUMN "twitchCategoryId" DROP NOT NULL`
    );
    await queryRunner.query(
      `INSERT INTO game (id, name, "displayName", "setGameName", "twitchCategoryId", "coverArtUrl") ` +
        ` VALUES (6, 'youtube', 'Youtube', 'youtube', null, null)`
    );
  }
  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DELETE FROM game where id = 6`);
    await queryRunner.query(
      `ALTER TABLE "game" ALTER COLUMN "twitchCategoryId" SET NOT NULL`
    );
  }
}
