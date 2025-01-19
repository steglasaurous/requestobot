import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1709249266297 implements MigrationInterface {
  name = 'Migration1709249266297';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO setting_definition (name, "defaultValue", choices) values ('queuestrategy', 'fifo', 'fifo,oneperuser,random')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM setting_definition where name = 'queuestrategy'`,
    );
  }
}
