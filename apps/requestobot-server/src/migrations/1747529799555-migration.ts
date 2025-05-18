import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1747529799555 implements MigrationInterface {
  name = 'Migration1747529799555';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."player_state_enum" AS ENUM('stopped', 'playing', 'paused')`
    );
    await queryRunner.query(
      `CREATE TABLE "player" ("id" SERIAL NOT NULL, "state" "public"."player_state_enum" NOT NULL DEFAULT 'stopped', "channelId" integer NOT NULL, "songId" integer, CONSTRAINT "REL_8ceebac41af2420559e5fcaabf" UNIQUE ("channelId"), CONSTRAINT "PK_65edadc946a7faf4b638d5e8885" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "player" ADD CONSTRAINT "FK_8ceebac41af2420559e5fcaabfb" FOREIGN KEY ("channelId") REFERENCES "channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "player" ADD CONSTRAINT "FK_89ff1b2d93f6049e6d2954b9009" FOREIGN KEY ("songId") REFERENCES "song"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "player" DROP CONSTRAINT "FK_89ff1b2d93f6049e6d2954b9009"`
    );
    await queryRunner.query(
      `ALTER TABLE "player" DROP CONSTRAINT "FK_8ceebac41af2420559e5fcaabfb"`
    );
    await queryRunner.query(`DROP TABLE "player"`);
    await queryRunner.query(`DROP TYPE "public"."player_state_enum"`);
  }
}
