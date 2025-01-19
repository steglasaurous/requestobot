import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1721952141794 implements MigrationInterface {
  name = 'Migration1721952141794';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_refresh_token" ("id" SERIAL NOT NULL, "token" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "expiresOn" TIMESTAMP WITH TIME ZONE NOT NULL, "userId" integer, CONSTRAINT "PK_2f86bb87603956e017efa2e74ec" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "song" ADD "dataSignature" character varying`
    );
    // Create signatures for existing songs - add the pgcrypto postgres extension so we can generate digests.
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto`);

    await queryRunner.query(
      `UPDATE "song" SET "dataSignature" = encode(digest(CONCAT("title", "artist", "mapper", "downloadUrl", "bpm", "duration", "fileReference", "coverArtUrl"), 'sha256'), 'hex')`
    );

    await queryRunner.query(
      `ALTER TABLE "song" ALTER COLUMN "dataSignature" SET NOT NULL`
    );

    await queryRunner.query(
      `ALTER TABLE "user_refresh_token" ADD CONSTRAINT "FK_9e2418637bd2ee8d14c7ccb1e34" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_refresh_token" DROP CONSTRAINT "FK_9e2418637bd2ee8d14c7ccb1e34"`
    );
    await queryRunner.query(`ALTER TABLE "song" DROP COLUMN "dataSignature"`);
    await queryRunner.query(`DROP TABLE "user_refresh_token"`);
    await queryRunner.query(`DROP EXTENSION pgcrypto`);
  }
}
