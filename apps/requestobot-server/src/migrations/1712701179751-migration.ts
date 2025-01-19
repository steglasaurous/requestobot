import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1712701179751 implements MigrationInterface {
  name = 'Migration1712701179751';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "song_ban" ("id" SERIAL NOT NULL, "songId" integer NOT NULL, "channelChannelName" character varying NOT NULL, CONSTRAINT "UQ_e93a47294611cf6d031a2602007" UNIQUE ("channelChannelName", "songId"), CONSTRAINT "PK_1df6f033f2dc14890c90a0ee4a1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "song_ban" ADD CONSTRAINT "FK_1c08eeb13b5c982d65f0a08d480" FOREIGN KEY ("songId") REFERENCES "song"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "song_ban" ADD CONSTRAINT "FK_de43fd4ad042868a40b34abee4a" FOREIGN KEY ("channelChannelName") REFERENCES "channel"("channelName") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "song_ban" DROP CONSTRAINT "FK_de43fd4ad042868a40b34abee4a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "song_ban" DROP CONSTRAINT "FK_1c08eeb13b5c982d65f0a08d480"`,
    );
    await queryRunner.query(`DROP TABLE "song_ban"`);
  }
}
