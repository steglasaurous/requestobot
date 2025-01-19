import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1703611705901 implements MigrationInterface {
    name = 'Migration1703611705901'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "game" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "displayName" character varying NOT NULL, "setGameName" character varying NOT NULL, "twitchCategoryId" character varying NOT NULL, CONSTRAINT "UQ_5d1e08e04b97aa06d671cd58409" UNIQUE ("name"), CONSTRAINT "PK_352a30652cd352f552fef73dec5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`, ["queuebot","public","song","GENERATED_COLUMN","songSearch","to_tsvector('english', coalesce(title, '') || ' ' || coalesce(artist, '') || ' ' || coalesce(mapper, ''))"]);
        await queryRunner.query(`CREATE TABLE "song" ("id" SERIAL NOT NULL, "songHash" character varying NOT NULL, "title" character varying NOT NULL, "artist" character varying NOT NULL, "mapper" character varying NOT NULL, "duration" integer, "bpm" integer, "downloadUrl" character varying, "fileReference" character varying, "songSearch" tsvector GENERATED ALWAYS AS (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(artist, '') || ' ' || coalesce(mapper, ''))) STORED NOT NULL, "gameId" integer, CONSTRAINT "UQ_4f2e03f5d2c2e196a9066538511" UNIQUE ("songHash"), CONSTRAINT "PK_baaa977f861cce6ff954ccee285" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "song_request" ("id" SERIAL NOT NULL, "requesterName" character varying NOT NULL, "requestTimestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "requestOrder" integer NOT NULL, "isActive" boolean NOT NULL DEFAULT false, "isDone" boolean NOT NULL DEFAULT false, "songId" integer NOT NULL, "channelChannelName" character varying NOT NULL, CONSTRAINT "UQ_db0193cbefd39db62bbd46a212d" UNIQUE ("channelChannelName", "songId"), CONSTRAINT "PK_c2b53ff7f5fc5bf370a3f32ebf8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_bot_state" ("id" SERIAL NOT NULL, "requesterName" character varying NOT NULL, "state" text, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "channelChannelName" character varying, CONSTRAINT "PK_1b763a0038f12ae306dd4a9f9f8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "channel" ("channelName" character varying NOT NULL, "inChannel" boolean NOT NULL, "enabled" boolean NOT NULL DEFAULT true, "joinedOn" TIMESTAMP WITH TIME ZONE NOT NULL, "queueOpen" boolean NOT NULL DEFAULT true, "leftOn" TIMESTAMP WITH TIME ZONE, "lang" character varying NOT NULL DEFAULT 'en', "gameId" integer, CONSTRAINT "PK_5e14b4df8f849a695c6046fe741" PRIMARY KEY ("channelName"))`);
        await queryRunner.query(`CREATE TABLE "user_auth_source" ("id" SERIAL NOT NULL, "authSource" character varying NOT NULL, "authSourceUserId" character varying NOT NULL, "authSourceProfileData" text, "userId" integer, CONSTRAINT "UQ_15e21e7f29b09b5df04adde421e" UNIQUE ("userId", "authSource"), CONSTRAINT "PK_08095b14ec15409502f7d02f844" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "displayName" character varying NOT NULL, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "song" ADD CONSTRAINT "FK_1c4da7f8b290d50dc07a9ca6bab" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "song_request" ADD CONSTRAINT "FK_4af173bdba31c1f42b5398add20" FOREIGN KEY ("songId") REFERENCES "song"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "song_request" ADD CONSTRAINT "FK_3bbf4ded0801d7055cd0d5473aa" FOREIGN KEY ("channelChannelName") REFERENCES "channel"("channelName") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_bot_state" ADD CONSTRAINT "FK_ab77da784b7259850927bacf51c" FOREIGN KEY ("channelChannelName") REFERENCES "channel"("channelName") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "channel" ADD CONSTRAINT "FK_d87d7370a6433219a9b73982070" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_auth_source" ADD CONSTRAINT "FK_2d0e40a8d133066614dd2c22e9c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

        // Added manually for full-text search on songs
        // Create index on song_search column so we get nice speedy searches
        // See https://www.postgresql.org/docs/current/textsearch-tables.html#TEXTSEARCH-TABLES-INDEX
        await queryRunner.query(`CREATE INDEX songSearchIdx ON song USING GIN ("songSearch")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX songSearchIdx`);
        await queryRunner.query(`ALTER TABLE "user_auth_source" DROP CONSTRAINT "FK_2d0e40a8d133066614dd2c22e9c"`);
        await queryRunner.query(`ALTER TABLE "channel" DROP CONSTRAINT "FK_d87d7370a6433219a9b73982070"`);
        await queryRunner.query(`ALTER TABLE "user_bot_state" DROP CONSTRAINT "FK_ab77da784b7259850927bacf51c"`);
        await queryRunner.query(`ALTER TABLE "song_request" DROP CONSTRAINT "FK_3bbf4ded0801d7055cd0d5473aa"`);
        await queryRunner.query(`ALTER TABLE "song_request" DROP CONSTRAINT "FK_4af173bdba31c1f42b5398add20"`);
        await queryRunner.query(`ALTER TABLE "song" DROP CONSTRAINT "FK_1c4da7f8b290d50dc07a9ca6bab"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "user_auth_source"`);
        await queryRunner.query(`DROP TABLE "channel"`);
        await queryRunner.query(`DROP TABLE "user_bot_state"`);
        await queryRunner.query(`DROP TABLE "song_request"`);
        await queryRunner.query(`DROP TABLE "song"`);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`, ["GENERATED_COLUMN","songSearch","queuebot","public","song"]);
        await queryRunner.query(`DROP TABLE "game"`);
    }

}
