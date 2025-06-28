import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1747770998745 implements MigrationInterface {
  name = 'Migration1747770998745';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO game (id, name, "displayName", "setGameName", "twitchCategoryId", "coverArtUrl") VALUES (7, 'freeform', 'Freeform', 'freeform', '0', '')`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM song_request where "songId" IN(SELECT id from song where "gameId" = 7)`
    );
    await queryRunner.query(`DELETE FROM song where "gameId" = 7`);
    await queryRunner.query(`DELETE FROM game where id = 7`);
  }
}
