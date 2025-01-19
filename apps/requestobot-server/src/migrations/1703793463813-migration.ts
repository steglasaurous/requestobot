import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1703793463813 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('PW_OST_01','Trap Requiem','"Apashe, Tha Tricka','OST',213,null,3)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('PW_OST_02','Religion','Black Tiger Sex Machine','OST',336,null,3)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('PW_OST_03','Black Magic','"Lektrique, Sam Lamar','OST',166,null,3)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('PW_OST_04','Revelations','HVDES','OST',207,null,3)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('PW_OST_05','Arbiter','Draeden','OST',174,null,3)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('PW_OST_06','Another Day','Dabin, Outwild','OST',null,null,3)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('PW_OST_07','Dark Skies','Draeden','OST',177,null,3)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('PW_OST_08','The Grave feat. Gabriella Hook','"Apashe, Black Tiger Sex Machine','OST',229,null,3)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('PW_OST_09','Full Throttle','"Lektrique, MIDNIGHT CVLT','OST',332,null,3)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('PW_OST_10','Akuma','HVDES','OST',296,null,3)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('PW_OST_11','The High Priestess','"Sam Lamar, CMOR','OST',159,null,3)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('PW_OST_12','Download the Future','Black Tiger Sex Machine','OST',null,null,3)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('PW_OST_13','Replicants','Black Tiger Sex Machine','OST',161,null,3)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('PW_OST_14','R U Afraid','HVDES','OST',133,null,3)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('PW_OST_15','Lilith - Sullivan King Remix','"Dabin, Apashe, Sullivan King','OST',null,null,3)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('PW_OST_16','The Fall','Dabin','OST',null,null,3)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('PW_OST_17','Death feat. Lektrique', 'Black Tiger Sex Machine','OST',null,null,3)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('PW_OST_18','Embers feat. Jill Harris','"Dabin, Jill Harris','OST',null,null,3)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('PW_OST_19','Uprising','Magic Sword','OST',304,null,3)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('PW_OST_20','Strange Creatures','Black Tiger Sex Machine','OST',200,null,3)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('PW_OST_21','Say Ma','Processor','OST',259,null,3)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('PW_OST_22','Sword of Truth','Magic Sword','OST',234,null,3)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('PW_OST_23','The Way Home','Magic Sword','OST',255,null,3)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM song WHERE songHash LIKE 'PW_OST_%'`);
  }
}
