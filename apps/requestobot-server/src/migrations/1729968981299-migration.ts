import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1729968981299 implements MigrationInterface {
  name = 'Migration1729968981299';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Trash all existing audio trip songs EXCEPT for the OSTs.  This is to
    // handle the transition from using the spreadsheet to using trippytunes.club,
    // which has unique ids for us to use as hashes.
    await queryRunner.query(
      'DELETE from song_request where "songId" IN(select id from song where "gameId" = 1 AND mapper != \'OST\')'
    );
    await queryRunner.query(
      'DELETE from song where "gameId" = 1 AND mapper != \'OST\''
    );
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    // There's no coming back from these changes, heh.
  }
}
