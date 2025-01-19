import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialStaticDataMigration1703611705901
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    /*
     * Games
     */
    await queryRunner.query(
      `INSERT INTO game ("name", "displayName", "twitchCategoryId", "setGameName") VALUES ('audio_trip', 'Audio Trip', '514866', 'audio trip')`,
    );
    await queryRunner.query(
      `INSERT INTO game ("name", "displayName", "twitchCategoryId", "setGameName") VALUES ('spin_rhythm', 'Spin Rhythm XD', '514201', 'spin rhythm xd')`,
    );

    /*
     * Game OSTs
     */

    // Audio Trip
    await queryRunner.query(
      `INSERT INTO song ("songHash", title, artist, mapper, duration, bpm, "gameId") VALUES ('cfb47d92499d864ad95bd05749e8d64d3d9830090dc241158ade6c4255f6360c','Addicted To A Memory','Zedd','OST',293,128,1)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", title, artist, mapper, duration, bpm, "gameId") VALUES ('abb78845d58dccb09b94ac8d2ef74e00e49f64a1aef9ec5a73c40371f85bdedb','Anemone','Naden','OST',327,123,1)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", title, artist, mapper, duration, bpm, "gameId") VALUES ('d4dfa4ac73a0c0c16e1cb1854fd262c95a008c8df0aa9f08da85b6958b01c9ed','Back ''N'' Forth','Milano','OST',185,125,1)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", title, artist, mapper, duration, bpm, "gameId") VALUES ('a95df1a06b107b9fec4b32d20043651bed01624d0127dd07f6799260a3efeee9','Bangarang','Skrillex','OST',212,110,1)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", title, artist, mapper, duration, bpm, "gameId") VALUES ('efc241d305fb45e7ed72ad765e04cc1204de951ea3df69ff42d7f192c4fac48b','Can''t Take It pt 2','Hot Rod Elegants','OST',164,102,1)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", title, artist, mapper, duration, bpm, "gameId") VALUES ('1dd7ccb25d06f22b7221616a68806fbf7b172633e7859e6ad3723c50a0ac63d0','Caution (GOOD Remix)','Skrxlla','OST',183,126,1)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", title, artist, mapper, duration, bpm, "gameId") VALUES ('4a1a41a75c0724e8dbf965ddcd612bf90612c08e2c655addccc806e11046e6cb','Dance Monkey','Tones and I','OST',208,98,1)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", title, artist, mapper, duration, bpm, "gameId") VALUES ('4e2a77c8f875df4015fea8bfa8e7f9113ce382461dd63a842ff1196328cb8126','Drift','Rafael Frost','OST',193,128,1)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", title, artist, mapper, duration, bpm, "gameId") VALUES ('75e6beb754db10ad828a92b6c58e041399cb4e43fd4924a5aa7da1d16d097ea8','Everybody Get Up','Ian Post','OST',109,99,1)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", title, artist, mapper, duration, bpm, "gameId") VALUES ('547fe1e5f83813a3b65bd8825f3e0c73aef6ba7ad31f0698502082cad9150974','Freedom','The Originals','OST',148,118,1)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", title, artist, mapper, duration, bpm, "gameId") VALUES ('8ea2b6d163f71697e640b45c5f005c6b286e67542b02b966ac70981626e8403f','Gangnam Style','PSY','OST',216,132,1)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", title, artist, mapper, duration, bpm, "gameId") VALUES ('00fa3b5e9d60e5d96ab4a41979011f2f500051d1267f8d8b26820c54b312a99f','Golden Pineapple','Tolan','OST',159,110,1)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", title, artist, mapper, duration, bpm, "gameId") VALUES ('eef733ba11a676436c96ee9c9151290180900a558fc7e682ee2dc083b586df21','Hit the Beat','IamDayLight','OST',201,100,1)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", title, artist, mapper, duration, bpm, "gameId") VALUES ('704344c5732f62b959f22af040de879d5e45c23e75341ccd6eafdd5f0df97976','I''ve Been Thinkin','Dimitrix','OST',213,126,1)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", title, artist, mapper, duration, bpm, "gameId") VALUES ('5e7ecb83eeb4be0b20de6356ca71c114e1f1b81f23d5a1ef7028dc41309c6f26','Jurassic Snack Pack','Prototyperaptor','OST',375,130,1)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", title, artist, mapper, duration, bpm, "gameId") VALUES ('1735642c1c2c35ec018a978fc86736cacce23beae1f902cd060793b1b7e192f6','Just Dance','Lady Gaga','OST',238,119,1)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", title, artist, mapper, duration, bpm, "gameId") VALUES ('0016b66073ca1d62eb26d6c00927160e5e75ead4da1c85e0b1704edb81e57693','Keep My Cool','Benj Heard','OST',175,112,1)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", title, artist, mapper, duration, bpm, "gameId") VALUES ('bf5f56abe745f54e93549837bb889aad93985517f6769e39198404a1cd7a1000','Krishna','Dropgun','OST',159,128,1)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", title, artist, mapper, duration, bpm, "gameId") VALUES ('7ea3ed428bb5eb9eefb2f2b4cc4ea3b4d434e46287d83ca962d2bfdc18c1b27e','Makamba','Trobi & Vorwerk','OST',126,108,1)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", title, artist, mapper, duration, bpm, "gameId") VALUES ('715b70567d4bddfa63676e8684096dac021fd622aa340b316ad1610750cacbbf','Mandala','Blastoyz','OST',349,143,1)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", title, artist, mapper, duration, bpm, "gameId") VALUES ('20d3e4e8a7c5961a10609bca7e8f35a1a67227643bb75b4b2141995db5927e5a','Mini Me (GOOD Remix)','Skrxlla','OST',140,110,1)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", title, artist, mapper, duration, bpm, "gameId") VALUES ('35f419cfa5bd72e7545f971652c1d8909719ca4d135521314b398b38590182ea','Mythologica','Ofrin','OST',153,85,1)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", title, artist, mapper, duration, bpm, "gameId") VALUES ('c214ce00764d54a55f0463547e860cdf93d3fdda00df88f6f462245dde782fa5','Red','Rafael Frost','OST',451,136,1)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", title, artist, mapper, duration, bpm, "gameId") VALUES ('652ed0cdeef253a18587d2ac0fae591240229598b9115f2fc9e04120b0c97ab3','Satisfaction','Benny Benassi','OST',284,130,1)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", title, artist, mapper, duration, bpm, "gameId") VALUES ('947e6791281192996f59b50cd5f0e5e7204673b315cd04d67f523296d71ba19c','Show Me','Tiesto, DallasK','OST',169, 128, 1)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", title, artist, mapper, duration, bpm, "gameId") VALUES ('d426906809df0bfe875162082180360421ac14abf467d410a4f19a0382b75ddc','SIDthesize','InSine','OST',192,100,1)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", title, artist, mapper, duration, bpm, "gameId") VALUES ('65f48e663f369172b9ba45462a5f603f1640d74e3ddaf4a5e2581bbcfe5eeb46','Sofi Needs a Ladder','Deadmau5','OST',334,128,1)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", title, artist, mapper, duration, bpm, "gameId") VALUES ('1b636d149e6d539898e90431727ea5a54880dfa8e017062aec2a763096a131cb','Take It to the Top','Ofrin','OST',198,127,1)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", title, artist, mapper, duration, bpm, "gameId") VALUES ('22f47f8a22a68dfe65c2fd21d4039d8f0ac331ef35175374395d3d64204b93c4','Technicolor Love','Divine Attraction','OST',212,120,1)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", title, artist, mapper, duration, bpm, "gameId") VALUES ('1b1d0e2247bfc9b8d0830c657cdd1c634ed46061a9d4aefd8d4a05a64df548e8','X-Type','I KILL PXLS','OST',221,130,1)`,
    );

    // Spin Rhythm XD

    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST0','Tutorial','Spin Rhythm','OST',55,92,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST1','New Game','Nitro Fun','OST',130,128,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST2','Checkpoint','Nitro Fun & Hyper Potions','OST',174,140,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST3','Inject','Droptek','OST',155,172,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST4','2 Minutes','Kitty feat. Lazerdisk and Rytmeklubben','OST',222,135,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST5','Humanity','Max Brhon','OST',196,110,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST6','Hypersphere','Douglas Holmquist','OST',202,108,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST7','Time','Supathick','OST',182,100,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST8','Ghost Ship','Teminite','OST',178,110,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST9','Beyond the Heart (Broken Heart Mix)','Lena Raine','OST',183,130,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST10','Adventures','Hyper Potions & Subtact','OST',180,80,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST11','Highscore','Teminite & Panda Eyes','OST',192,110,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST12','Never Count on Me','Haywyre','OST',201,90,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST13','cold rock it','2 Mello','OST',254,166,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST14','I See Lite','Kitty','OST',178,155,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST15','BUBBLES','Tokyo Machine','OST',233,128,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST16','Dying Scarlet','Akira Complex','OST',236,110,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST17','Superimposed_RGB','Douglas Holmquist','OST',197,155,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST18','Water Elemental','Sharks & Chime','OST',200,150,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST19','Velours','Anomalie','OST',262,89,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST20','Revenger','F.O.O.L','OST',218,110,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST21','Show Me Love (nxwyxrk remix)','Aimee Francis','OST',200,160,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST22','My Museum','Maxo','OST',200,120,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST23','Let Me Hear That','Haywyre','OST',205,110,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST24','The Magician','seejay','OST',247,130,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST25','Lovesick','Moe Shop feat. maisou','OST',175,120,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST26','Showdown','F.O.O.L','OST',246,125,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST27','Robo Trio','Oxford Parker','OST',174,186,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST28','Reach You','Maxo','OST',214,160,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST29','Engine Start','modus','OST',240,126,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST30','Your Pain','Koven','OST',200,150,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST31','Twist Sound','2 Mello','OST',199,111,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST32','Voidwalkers','Au5 & Chime','OST',228,142,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST33','Prism Bucket','Mr Kapow & Martiln','OST',183,155,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST34','The Kraken','Teminite','OST',272,150,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST35','Arcana Engine','Monomer','OST',225,151,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST36','New Year','Hyper Potions','OST',189,160,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST37','Sector Five','modus','OST',233,146,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST38','Dance With Silence','Camellia','OST',283,128,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST39','Whirlpool','Sharks & Skybreak','OST',283,150,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST40','Ginger Lizard','Opiuo','OST',167,118,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST41','Mimic','Droptek','OST',243,172,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST42','Spin Cycle','Daverwob','OST',143,116,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST43','Heading East','FarfetchD','OST',201,110,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST44','Pirate Afterparty','Teminite','OST',236,110,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST45', 'No Limits', 'modus, Loudar','OST', 267,225,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST46','Metropole','Anomalie','OST',278,100,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST47','Colorblind','Panda Eyes','OST',223,150,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST48','This Is It','Rogue','OST',224,108,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST49','Platform 9','Oneeva','OST',221,126,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST50','Lights Camera Action','meganeko','OST',211,118,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST51','Go Outside','Phonetic Hero','OST',198,96,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST52','VOLT','Modern Revolt','OST',186,128,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST53','Air On Line','Anamanaguchi','OST',285,95,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST54','Flight','Tristam & Braken','OST',215,175,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST55','Coming Too','FarfetchD feat. Elysium and Nutmeg','OST',201,112,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST56','Razor Sharp','Pegboard Nerds & Tristam','OST',268,110,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST57','Raise The Black Flag','Teminite','OST',281,145,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST58','Hot Pursuit','Tut Tut Child','OST',301,140,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST59','Rattlesnake','Rogue','OST',170,175,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST60','Body F10ating in the Zero Gravity Space','Camellia','OST',278,170,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST61','One Esk Nineteen','Praxis Axis','OST',300,125,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST62','Believe','Teminite','OST',339,150,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST63','Final Boss','Nitro Fun','OST',318,130,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_OST64','Dry Dreams','Daverwob','OST',170,126,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_DLC1','Cheat Codes','Nitro Fun','OST',206,128,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_DLC2','CRAZY','Tokyo Machine','OST',202,128,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_DLC3','Into The Light','Notaker feat. Karra','OST',199,100,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_DLC4','Shut My Mouth','Koven','OST',221,150,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_DLC5','THE DROP','Gammer','OST',237,150,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_DLC6','Blue Shadows','Xilent','OST',242,150,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_DLC7','Overkill','RIOT','OST',306,174,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_DLC8','U Got Me','Bossfight','OST',190,150,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_DLC9','How We Win','FWLR','OST',220,126,2)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES ('SRXD_DLC10','It''s All Over','ShockOne','OST',237,150,2)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM song where id > 0`);
    await queryRunner.query(`DELETE FROM game where id > 0`);
  }
}
