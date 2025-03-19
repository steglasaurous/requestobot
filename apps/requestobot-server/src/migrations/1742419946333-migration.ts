import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1742419946333 implements MigrationInterface {
  name = 'Migration1742419946333';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO public.song ("songHash", title, artist, mapper, duration, bpm, "downloadUrl",
                                                      "fileReference", "gameId", "coverArtUrl", "dataSignature")
                             VALUES ('SR_OST_149', 'Got You', 'Sunset Neon', 'OST', NULL, NULL, NULL, NULL, 5, NULL,
                                     '7ce1c36ca7c3e0b3e6e5a86c1c1d94cf14b011f2c40f987ea64f21bc5a8a8650'),
                                    ('SR_OST_150', 'Hex', 'Dance with the Dead', 'OST', NULL, NULL, NULL, NULL, 5, NULL,
                                     '02ce9c4708ac4a7f4dd06dbef9ec4f55a5b6a9596c1b5ca0ff99a1ea04a95ab5'),
                                    ('SR_OST_151', 'Carol of the Bells', 'Dance with the Dead', 'OST', NULL, NULL, NULL,
                                     NULL, 5, NULL, '0a7a6e69a20c18b60f844a3b446f2c57ed4a47bdc45fad1f4089aad4bfbae9b7'),
                                    ('SR_OST_152', 'Shangri-la-la-la', 'Walkabout Mini Golf feat. Chris Reyma', 'OST',
                                     NULL, NULL, NULL, NULL, 5, NULL,
                                     '0ae3cdf7ccb9f6cb9d302bfe18b86eb2d4b4d37ee7dbb49336c9ead798b9ddca'),
                                    ('SR_OST_153', 'Barbie Dreams (Feat. Kali)', 'Fifty Fifty', 'OST', NULL, NULL, NULL,
                                     NULL, 5, NULL, '4511bd3e59b0bc09878c0d26e9c42c21dc4c463a15c90cc522a13f85b7eec7f8'),
                                    ('SR_OST_154', 'I Don''t Wanna Wait', 'David Guetta & One Republic', 'OST', NULL,
                                     NULL, NULL, NULL, 5, NULL,
                                     '6fd1c4c08f40c52ba3d0ae2ade18d9f1ec58b9a9bb0b1e8b8c36e4bed0363c93'),
                                    ('SR_OST_155', 'Gimme Love', 'Sia', 'OST', NULL, NULL, NULL, NULL, 5, NULL,
                                     'edb16a80bd3fe04b3474e45d9e1271cda1b3e04d76ca18bb1a4a953e0c5e23dc'),
                                    ('SR_OST_156', 'I Like The Way You Kiss Me', 'Artemas', 'OST', NULL, NULL, NULL,
                                     NULL, 5, NULL, '1ff1ebb5fc1a9bebe8e43c37a506cd7b16f47aa0c7f5777eb2361e8ff92a1b94'),
                                    ('SR_OST_157', 'Apple', 'Charli xcx', 'OST', NULL, NULL, NULL, NULL, 5, NULL,
                                     '5c0ebfa88058c1276a4f7992d0ccef0f5e8bb9ba6df73bf5bd4ea3d895254df4'),
                                    ('SR_OST_158', 'Lovin On Me', 'Jack Harlow', 'OST', NULL, NULL, NULL, NULL, 5, NULL,
                                     'cabe93e81f31f1a7d4f5ac8035739e5e3d25288bd2f51a096767a4c59f5fa8d7')`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE
                             FROM song
                             WHERE songHash IN
                                   ('SR_OST_149', 'SR_OST_150', 'SR_OST_151', 'SR_OST_152', 'SR_OST_153', 'SR_OST_154',
                                    'SR_OST_155', 'SR_OST_156', 'SR_OST_157', 'SR_OST_158')`);
  }
}
