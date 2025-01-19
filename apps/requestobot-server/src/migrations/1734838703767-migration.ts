import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1734838703767 implements MigrationInterface {
  name = 'Migration1734838703767';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "song_request" DROP CONSTRAINT "FK_3bbf4ded0801d7055cd0d5473aa"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_bot_state" DROP CONSTRAINT "FK_ab77da784b7259850927bacf51c"`
    );
    await queryRunner.query(
      `ALTER TABLE "song_ban" DROP CONSTRAINT "FK_de43fd4ad042868a40b34abee4a"`
    );
    await queryRunner.query(
      `ALTER TABLE "setting" DROP CONSTRAINT "FK_01d860125edcb5852e54a754fa0"`
    );
    await queryRunner.query(
      `ALTER TABLE "song_request" DROP CONSTRAINT "UQ_db0193cbefd39db62bbd46a212d"`
    );
    await queryRunner.query(
      `ALTER TABLE "song_ban" DROP CONSTRAINT "UQ_e93a47294611cf6d031a2602007"`
    );
    await queryRunner.query(`ALTER TABLE "channel" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "channel" DROP CONSTRAINT "PK_5e14b4df8f849a695c6046fe741"`
    );
    await queryRunner.query(
      `ALTER TABLE "channel" ADD CONSTRAINT "PK_590f33ee6ee7d76437acf362e39" PRIMARY KEY ("id")`
    );
    await queryRunner.query(
      `ALTER TABLE "channel" ADD "chatServiceName" character varying NOT NULL DEFAULT 'twitch'`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_d15c63a2099aab647860b3d4d9" ON "channel" ("channelName", "chatServiceName")`
    );
    await queryRunner.query(
      `ALTER TABLE "setting" ADD "channelId" integer NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "setting" ADD CONSTRAINT "FK_6848ac01dfd139ae1a84b848793" FOREIGN KEY ("channelId") REFERENCES "channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `UPDATE "setting" s set "channelId" = c."id" FROM channel c WHERE s."channelChannelName" = c."channelName"`
    );
    await queryRunner.query(
      `ALTER TABLE "setting" ALTER COLUMN "channelId" SET NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "setting" DROP COLUMN "channelChannelName"`
    );
    await queryRunner.query(
      `ALTER TABLE "song_request" ADD "channelId" integer NULL`
    );
    await queryRunner.query(
      `UPDATE "song_request" s set "channelId" = c."id" FROM channel c WHERE s."channelChannelName" = c."channelName"`
    );
    await queryRunner.query(
      `ALTER TABLE "song_request" ADD CONSTRAINT "UQ_d8958de0ac7d023f4edaefb2f4d" UNIQUE ("channelId", "songId")`
    );
    await queryRunner.query(
      `ALTER TABLE "song_request" ALTER COLUMN "channelId" SET NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "song_request" DROP COLUMN "channelChannelName"`
    );

    await queryRunner.query(
      `ALTER TABLE "song_ban" ADD "channelId" integer NULL`
    );
    await queryRunner.query(
      `UPDATE "song_ban" s set "channelId" = c."id" FROM channel c WHERE s."channelChannelName" = c."channelName"`
    );
    await queryRunner.query(
      `ALTER TABLE "song_ban" ALTER COLUMN "channelId" SET NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "song_ban" ADD CONSTRAINT "UQ_6ebbd02ec7357ce205f47d61f86" UNIQUE ("channelId", "songId")`
    );
    await queryRunner.query(
      `ALTER TABLE "song_ban" DROP COLUMN "channelChannelName"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_bot_state" ADD "channelId" integer NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "user_bot_state" ADD CONSTRAINT "FK_fdfcf95c988f9850ee35bb452e6" FOREIGN KEY ("channelId") REFERENCES "channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `UPDATE "user_bot_state" s set "channelId" = c."id" FROM channel c WHERE s."channelChannelName" = c."channelName"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_bot_state" ALTER COLUMN "channelId" SET NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
