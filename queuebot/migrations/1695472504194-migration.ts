import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1695472504194 implements MigrationInterface {
  name = 'Migration1695472504194';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Remove any rows that have null values in them, since this will break when we
    await queryRunner.query('DELETE FROM song_request where songId is NULL');
    await queryRunner.query(
      `CREATE TABLE "temporary_song_request" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "requesterName" varchar NOT NULL, "requestTimestamp" integer NOT NULL, "requestOrder" integer NOT NULL, "songId" integer, "channelChannelName" varchar, CONSTRAINT "UQ_db0193cbefd39db62bbd46a212d" UNIQUE ("channelChannelName", "songId"))`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_song_request"("id", "requesterName", "requestTimestamp", "requestOrder", "songId", "channelChannelName") SELECT "id", "requesterName", "requestTimestamp", "requestOrder", "songId", "channelChannelName" FROM "song_request"`,
    );
    await queryRunner.query(`DROP TABLE "song_request"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_song_request" RENAME TO "song_request"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_song_request" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "requesterName" varchar NOT NULL, "requestTimestamp" integer NOT NULL, "requestOrder" integer NOT NULL, "songId" integer, "channelChannelName" varchar)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_song_request"("id", "requesterName", "requestTimestamp", "requestOrder", "songId", "channelChannelName") SELECT "id", "requesterName", "requestTimestamp", "requestOrder", "songId", "channelChannelName" FROM "song_request"`,
    );
    await queryRunner.query(`DROP TABLE "song_request"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_song_request" RENAME TO "song_request"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_song_request" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "requesterName" varchar NOT NULL, "requestTimestamp" integer NOT NULL, "requestOrder" integer NOT NULL, "songId" integer NOT NULL, "channelChannelName" varchar NOT NULL)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_song_request"("id", "requesterName", "requestTimestamp", "requestOrder", "songId", "channelChannelName") SELECT "id", "requesterName", "requestTimestamp", "requestOrder", "songId", "channelChannelName" FROM "song_request"`,
    );
    await queryRunner.query(`DROP TABLE "song_request"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_song_request" RENAME TO "song_request"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_song_request" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "requesterName" varchar NOT NULL, "requestTimestamp" integer NOT NULL, "requestOrder" integer NOT NULL, "songId" integer NOT NULL, "channelChannelName" varchar NOT NULL, CONSTRAINT "UQ_db0193cbefd39db62bbd46a212d" UNIQUE ("channelChannelName", "songId"))`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_song_request"("id", "requesterName", "requestTimestamp", "requestOrder", "songId", "channelChannelName") SELECT "id", "requesterName", "requestTimestamp", "requestOrder", "songId", "channelChannelName" FROM "song_request"`,
    );
    await queryRunner.query(`DROP TABLE "song_request"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_song_request" RENAME TO "song_request"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_song_request" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "requesterName" varchar NOT NULL, "requestTimestamp" integer NOT NULL, "requestOrder" integer NOT NULL, "songId" integer NOT NULL, "channelChannelName" varchar NOT NULL, CONSTRAINT "UQ_db0193cbefd39db62bbd46a212d" UNIQUE ("channelChannelName", "songId"), CONSTRAINT "FK_4af173bdba31c1f42b5398add20" FOREIGN KEY ("songId") REFERENCES "song" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_3bbf4ded0801d7055cd0d5473aa" FOREIGN KEY ("channelChannelName") REFERENCES "channel" ("channelName") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_song_request"("id", "requesterName", "requestTimestamp", "requestOrder", "songId", "channelChannelName") SELECT "id", "requesterName", "requestTimestamp", "requestOrder", "songId", "channelChannelName" FROM "song_request"`,
    );
    await queryRunner.query(`DROP TABLE "song_request"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_song_request" RENAME TO "song_request"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "song_request" RENAME TO "temporary_song_request"`,
    );
    await queryRunner.query(
      `CREATE TABLE "song_request" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "requesterName" varchar NOT NULL, "requestTimestamp" integer NOT NULL, "requestOrder" integer NOT NULL, "songId" integer NOT NULL, "channelChannelName" varchar NOT NULL, CONSTRAINT "UQ_db0193cbefd39db62bbd46a212d" UNIQUE ("channelChannelName", "songId"))`,
    );
    await queryRunner.query(
      `INSERT INTO "song_request"("id", "requesterName", "requestTimestamp", "requestOrder", "songId", "channelChannelName") SELECT "id", "requesterName", "requestTimestamp", "requestOrder", "songId", "channelChannelName" FROM "temporary_song_request"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_song_request"`);
    await queryRunner.query(
      `ALTER TABLE "song_request" RENAME TO "temporary_song_request"`,
    );
    await queryRunner.query(
      `CREATE TABLE "song_request" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "requesterName" varchar NOT NULL, "requestTimestamp" integer NOT NULL, "requestOrder" integer NOT NULL, "songId" integer NOT NULL, "channelChannelName" varchar NOT NULL)`,
    );
    await queryRunner.query(
      `INSERT INTO "song_request"("id", "requesterName", "requestTimestamp", "requestOrder", "songId", "channelChannelName") SELECT "id", "requesterName", "requestTimestamp", "requestOrder", "songId", "channelChannelName" FROM "temporary_song_request"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_song_request"`);
    await queryRunner.query(
      `ALTER TABLE "song_request" RENAME TO "temporary_song_request"`,
    );
    await queryRunner.query(
      `CREATE TABLE "song_request" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "requesterName" varchar NOT NULL, "requestTimestamp" integer NOT NULL, "requestOrder" integer NOT NULL, "songId" integer, "channelChannelName" varchar)`,
    );
    await queryRunner.query(
      `INSERT INTO "song_request"("id", "requesterName", "requestTimestamp", "requestOrder", "songId", "channelChannelName") SELECT "id", "requesterName", "requestTimestamp", "requestOrder", "songId", "channelChannelName" FROM "temporary_song_request"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_song_request"`);
    await queryRunner.query(
      `ALTER TABLE "song_request" RENAME TO "temporary_song_request"`,
    );
    await queryRunner.query(
      `CREATE TABLE "song_request" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "requesterName" varchar NOT NULL, "requestTimestamp" integer NOT NULL, "requestOrder" integer NOT NULL, "songId" integer, "channelChannelName" varchar, CONSTRAINT "UQ_db0193cbefd39db62bbd46a212d" UNIQUE ("channelChannelName", "songId"))`,
    );
    await queryRunner.query(
      `INSERT INTO "song_request"("id", "requesterName", "requestTimestamp", "requestOrder", "songId", "channelChannelName") SELECT "id", "requesterName", "requestTimestamp", "requestOrder", "songId", "channelChannelName" FROM "temporary_song_request"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_song_request"`);
    await queryRunner.query(
      `ALTER TABLE "song_request" RENAME TO "temporary_song_request"`,
    );
    await queryRunner.query(
      `CREATE TABLE "song_request" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "requesterName" varchar NOT NULL, "requestTimestamp" integer NOT NULL, "requestOrder" integer NOT NULL, "songId" integer, "channelChannelName" varchar, CONSTRAINT "UQ_db0193cbefd39db62bbd46a212d" UNIQUE ("channelChannelName", "songId"), CONSTRAINT "FK_4af173bdba31c1f42b5398add20" FOREIGN KEY ("songId") REFERENCES "song" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "song_request"("id", "requesterName", "requestTimestamp", "requestOrder", "songId", "channelChannelName") SELECT "id", "requesterName", "requestTimestamp", "requestOrder", "songId", "channelChannelName" FROM "temporary_song_request"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_song_request"`);
  }
}
