import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1703896119654 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "song" ALTER COLUMN "artist" DROP NOT NULL`,
    );

    await queryRunner.query(
      `INSERT INTO game ("name", "displayName", "twitchCategoryId", "setGameName") VALUES ('dance_dash', 'Dance Dash', '981134249', 'dance dash')`,
    );

    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('DD_OST_01','Deadbolt','Debisco','OST',101,128,4)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('DD_OST_02','Do this again','Movenchy','OST',142,128,4)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('DD_OST_03','EZ','Debisco','OST',131,140,4)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('DD_OST_04','Flashback','DeBisco','OST',152,128,4)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('DD_OST_05','Fly','Sly','OST',150,174,4)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('DD_OST_06','Get it','5tar','OST',111,138,4)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('DD_OST_07','Halogen','Zenpaku','OST',121,130,4)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('DD_OST_08','Lose Control','Sly','OST',125,125,4)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('DD_OST_09','Move that party','Kryzsztif Pietras','OST',180,160,4)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('DD_OST_10','Mystique','Zenpaku','OST',120,135,4)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('DD_OST_11','Part 2 You Coming Back','Abeck','OST',125,145,4)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('DD_OST_12','Retro space','Gennady','OST',192,125,4)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('DD_OST_13','Run 4 Cover','DeBisco','OST',123,135,4)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('DD_OST_14','The Way Of The Samurai','Dekibo','OST',169,98,4)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('DD_OST_15','Verity','Nokae + Zenpaku','OST',118,160,4)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('DD_OST_16','You''ll B There','DeBisco','OST',141,130,4)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM song WHERE "gameId" = 4`);
    await queryRunner.query(`DELETE FROM game where "name" = 'dance_dash'`);
    await queryRunner.query(
      `ALTER TABLE "song" ALTER COLUMN "artist" SET NOT NULL`,
    );
  }
}
