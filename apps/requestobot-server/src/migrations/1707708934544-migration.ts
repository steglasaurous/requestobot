import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1707708934544 implements MigrationInterface {
  name = 'Migration1707708934544';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "setting_definition" ("name" character varying NOT NULL, "defaultValue" character varying, CONSTRAINT "PK_a23e4d60df680e188bb548f9f85" PRIMARY KEY ("name"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "setting" ("id" SERIAL NOT NULL, "value" character varying NOT NULL, "channelChannelName" character varying NOT NULL, "settingNameName" character varying NOT NULL, CONSTRAINT "PK_fcb21187dc6094e24a48f677bed" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "setting" ADD CONSTRAINT "FK_01d860125edcb5852e54a754fa0" FOREIGN KEY ("channelChannelName") REFERENCES "channel"("channelName") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "setting" ADD CONSTRAINT "FK_e6c64422bdc13c6734f559c706a" FOREIGN KEY ("settingNameName") REFERENCES "setting_definition"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "setting" DROP CONSTRAINT "FK_e6c64422bdc13c6734f559c706a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "setting" DROP CONSTRAINT "FK_01d860125edcb5852e54a754fa0"`,
    );
    await queryRunner.query(`DROP TABLE "setting"`);
    await queryRunner.query(`DROP TABLE "setting_definition"`);
  }
}
