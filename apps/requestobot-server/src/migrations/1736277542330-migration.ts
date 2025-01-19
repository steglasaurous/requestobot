import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1736277542330 implements MigrationInterface {
  name = 'Migration1736277542330';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_bot_state" DROP COLUMN "channelChannelName"`
    );
    await queryRunner.query(
      `ALTER TABLE "game" ADD "coverArtUrl" character varying`
    );

    await queryRunner.query(
      `UPDATE "game" SET "coverArtUrl" = 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2phj.webp' WHERE name = 'audio_trip'`
    );
    await queryRunner.query(
      `UPDATE "game" SET "coverArtUrl" = 'https://images.igdb.com/igdb/image/upload/t_cover_big/co69h1.webp' WHERE name = 'spin_rhythm'`
    );
    await queryRunner.query(
      `UPDATE "game" SET "coverArtUrl" = 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1swl.webp' WHERE name = 'pistol_whip'`
    );
    await queryRunner.query(
      `UPDATE "game" SET "coverArtUrl" = 'https://images.igdb.com/igdb/image/upload/t_cover_big/co73k2.webp' WHERE name = 'dance_dash'`
    );
    await queryRunner.query(
      `UPDATE "game" SET "coverArtUrl" = 'https://images.igdb.com/igdb/image/upload/t_cover_big/co8umj.webp' WHERE name = 'synth_riders'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_bot_state" ADD "channelChannelName" character varying`
    );
    await queryRunner.query(`ALTER TABLE "game" DROP COLUMN "coverArtUrl"`);
  }
}
