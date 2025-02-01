import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1738416054868 implements MigrationInterface {
  name = 'Migration1738416054868';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Change unique constraint on songHash to songHash+gameId
    await queryRunner.query(
      `ALTER TABLE "song" DROP CONSTRAINT "UQ_4f2e03f5d2c2e196a9066538511"`
    );
    await queryRunner.query(
      `ALTER TABLE "song" ADD CONSTRAINT "UQ_e72403483b36250c803242a3582" UNIQUE ("songHash", "gameId")`
    );

    // Add Synth OSTs and DLCs
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_01','The Wild','Northern Born','OST',5, 'f996bd718e3616cec6bcaccd8c6af1fe10c5921856a45b98095bf3a766051c82')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_02','Hypothermia','Ryzu (feat. Noctilucent)','OST',5, '709d35ee3eb7e814b273f022d77973b9367fccb689e69e1642b270724889f637')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_03','Stay','ROY (feat. Elad)','OST',5, 'f0770c7e2932318cd5c04988283f3d402f17b003f8558191e89265dc3bf20a12')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_04','Raw','tiasu','OST',5, '4d1da5343ea4f605cf39e7a8791bb2e8aca4c2688b72475e57bff935ffb51d10')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_05','Get Up On My Keys','Duko','OST',5, 'e602c2b15fdd5952a926560d7c347ad594b4aaef5bc3f1666d4ada3419722169')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_06','On My Way','Finesu (feat. Ryan Konline)','OST',5, '7462ec962ee7dd6aaad03d08bd8725b8791bfdcd225a4bde8272b378429b1106')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_07','Stardust','Skybreak','OST',5, '64f35ee9776a8d6bee3db914f444c3800154dc0c7346b62fc34ddac3bcd43767')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_08','Spectrum','Axtasia','OST',5, 'd4cb1dd4e78496af0f0de6a882db52d71d8d631515a8770ed0d4113dd58842c9')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_09','Paris Night Walk','ROY','OST',5, '5aae80c00d20798dbfe726899f22ee79bc91e021b3965732fd487308d84466e7')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_10','Underdog','Kastra & Freshcobar','OST',5, '96616dd922c09195ee55ada65d6cd8a983dbcf505bdf2357832b3266f7594c11')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_11','Id','Reflekt & Ben Lepper','OST',5, '28a16a3f4a181536ff60881589885d35c1debe3d9a99c5c42de85a075540dcd2')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_12','Outburst','Never Modern Talk','OST',5, 'b9d781634f9cf2ba3a15d564920d692f13c31e9c9ed6ce56a0b0e4f21e68f1be')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_13','L.O.V.E.','Prizm','OST',5, '5092a5020054b3338935966402fa5d8be536ce4e0de750015194bcdcea7250bd')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_14','All Night','Prizm','OST',5, '8556353f17fd6f8290d41f4dc67b3ed04b8a378a862b7b7cc59f3fe3d76a9765')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_15','You know that you love me','Prizm','OST',5, 'f4c7e784ba6c4f5ad2de31dceadac46e7a4849ab422c7f55d687ccc54cb75405')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_16','Phoenix','Scandroid','OST',5, 'a6630618821cd6ece0ebac6db60159c866990d69e20d721a5c6fa58847ebde86')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_17','Into the Void (Synth Riders Edit)','Celldweller','OST',5, 'a7b78377f4f31c13f31d242a0d64162503db24e74f35b5922e395f08f8548b84')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_18','Unshakeable','Celldweller','OST',5, 'eaf9c2e8b6aa67781a9daabaa0115b76ce99cfd4159d3ea40a7a81acaf45b55a')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_19','Dust to Dust','Circle of Dust','OST',5, '30b49ddb0b8fa7dcfb41c90d83c567924b68dc3c097638b0798d908c801235a4')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_20','Wolves','VOICIANS','OST',5, '57415c0316ddbc7171d2fba88dbdbb16454a98058a6d26ce0dee04e59fc27544')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_21','Free','Raizer','OST',5, 'f03f6cba6ed378929adc723848008a0be2d495d82177b3c4ad9aef070ffc4452')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_22','Phoenix','Raizer','OST',5, '559f29169d0b89f23f851b8cd17d3b1bd3cdf71912150cb28b4167200108969d')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_23','Code war','Nutronic','OST',5, '1936100567d9c24d345975e5b2ebef574f34f60d76555c8fd00bea37c8f058d0')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_24','Enemy','Blue Stahli','OST',5, '014e2bc51da6ea35412624352b5c374b38cde1234cb392b5b00b2d0463bbd5a2')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_25','Tonight','Sunset Neon','OST',5, 'd4f3ba022d394d1d1e0aa75fbe5da1106bd3f235e1a674a3e69c8768ec666984')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_26','Lazer Pink','Sunset Neon','OST',5, 'f5b3043e23cd73099be21e41eeb9f3e082ac174de7c63176b86d273c2741250e')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_27','Neo-Tokyo (Dance with the Dead Remix)','Scandroid','OST',5, '91c0254b4c60292cc10707adda2118cbc17b0d8f738817889a1dca7d81547445')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_28','End of the Night (feat. Doubleboy)','Robert Parker','OST',5, 'd695ea314635b8c6164af42e3e1bffc580ecf4bc24d9d5a51357fe46b7ccbff9')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_29','Pursuit','Stilz','OST',5, '190b9b3b8ada6f6ee667da11aa72dc86f447c69a21f512d9b0b88fe6cceaad74')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_30','Choices','Waveshaper','OST',5, '61c519ce902f1694d561bd4c76977e2c9a1e7e2ad01b3dbb6fc43f33f86a2beb')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_31','Carbon Cult','DEADLIFE','OST',5, '7ef71451d31c079bbaf8f9cca1d763447c31d6cc0c0a3166faec4f61640fd510')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_32','From Hell','Dance with the Dead','OST',5, '751c03cd64b54cc3ef525359222feb341e270363360d8f341c0fbf9d5391dad1')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_33','Go!','Dance with the Dead','OST',5, 'c91da6da9a64dfb86a29a4ddaab6ad40d1d23b183afea2b3357aa3b3b6b8b812')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_34','Riot','Dance with the Dead','OST',5, '65a4a349ab47e10986f816597f93a9947d3d47ee9db123325a5b873414386503')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_35','Carol Of The Bells Remix','Dance with the Dead (Seasonal Content)','OST',5, 'a3cade21be02ea03e8a61a04fd2556fb521c77993208413655ff9994018c3234')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_36','Space Rock (Pylot Remix)','Powercyan','OST',5, '8c0c88630a56d2090a7c9c3e4fd4b2e592c5be3f40d0e5343e52a3b46283cc58')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_37','Galaxy Joyride','Wolf and Raven','OST',5, '7dd0cbc3680e0b1816037f5bcde49f88e7952b3ccd0f412f455fdd0bb2ebd2bb')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_38','Satanic Panic','Occams Laser','OST',5, '639d7adbeff4edc2ed237c86161fc54d7986b1ccae4dff7db2596cdcac6b3c6d')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_39','Vampirevania','Jeremiah Kane','OST',5, 'fe39989f0b5c747adfee60d8e5b4df0fa6e6117166b1255d385f828902cfcd28')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_40','The Curse','Das Mörtal','OST',5, '80e30c359c0d253d3533badb4275aa16c62c3bfff46d61febdeffa5ca573470c')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_41','Silver Stallion','Overvad','OST',5, '81caea3468f88262dbd28d0c1c6bc41cc6b4e12086ab802dbcaaadae9ab50602')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_42','Star Fighter','Wice','OST',5, '79e12ca7ad2b677b2c9cb59e8a0964964e885602e0cba876f6a4bc83534518c7')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_43','Sunset Hologram','Electric Runner','OST',5, 'aa37df52f46b976b426b06a09f6b93ab212bf0a829da05061020b29a1325ef55')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_44','Suppress it','3Force','OST',5, 'b8aa22ee7335b4f6d4f74897f0eaaf87cbf6c6985a3cabec7bfaa4ab9fad4c5e')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_45','Algorithm (Alternate Reality Version)','Muse','OST',5, 'f39694c6e0c338687a481bf1cee425c524ca995c6660e8e50d655b17556d0604')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_46','The Dark Side','Muse','OST',5, '8ce63cafaf6c56f59b40030f0226125c273344f3a09cfe968b8702a76201da68')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_47','Days of Thunder','The Midnight','OST',5, 'b1bdacf16f2d49cd632f1edb257523a35a001d6ce1768b8b8ebef76c5e3d8ef5')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_48','Running In The Night','FM-84 & Ollie Wride','OST',5, '830a7becd96eacccd07459090a0b686b6764ebd31bf2d7c72d4d78678d694238')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_49','Tech Noir (Carpenter Brut Remix)','Gunship','OST',5, '48c0ba39fd81871a58758965497ccb8b1a754f170f67f17b3bbc581fabb137a5')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_50','Automatic Call','NINA','OST',5, '73de40424513735b79c10ece0857a343c942ed9efed5c475fb85bafda2419077')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_51','Abyss','3FORCE (feat. Scandroid) (FiXT licensing info)','OST',5, 'd6eae3f887b645058a58e3d78ef7d02c9f6ce9d583d709aac6188c56513ac9f2')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_52','Empire of Steel','Essenger (feat. Scandroid) (FiXT licensing info)','OST',5, '92f097b61fa8260551ee3c5a7ea3b41ad094b15da62973b73e25560a6019c237')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_53','All Night','Parov Stelar','OST',5, '3aa4499acd6a72898f79faf9904ac920bcb09086fe1ce0a1e07ada1d32cb0d1d')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_54','Booty Swing','Parov Stelar','OST',5, '02a481c7c43a71cfad6ac5cc509c76622af300a71b3fc5a44baa4c0f7dd30f3c')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_55','Lost In The Rhythm','Jamie Berry','OST',5, '811c410dadb46ae2d4584df4e12a052ac8d8f97e786a20843bca69d825444ded')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_56','No Strings Attached','Swingrowers','OST',5, '61cd17319bec6d3ca16bb77d75c07ae8b95fe4d1267eb2a2e3a642c1a0f6f541')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_57','Butterfly','Swingrowers','OST',5, '6387209c1107520d8860500beed6f36914154d4eef0c9272ba7a4c3b2e4dc8ee')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_58','Nightmare Cure','DanyloM & Electro Swing Thing','OST',5, 'c68e99b8b4321e61a2481a4100777dcc8cec9e1de389c8e35aaa90f284915dc5')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_59','Imperfection','Wolfgang Lohr & Balduin (feat. Zouzoulectric)','OST',5, '2269764da9fcf9f593d064fc7535929c7f77d4ede45a80bc3e7a244c5eb10cea')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_60','Empires','The Electric Swing Circus','OST',5, 'eb43284e413062e872166691249954e047672dd62bd95f8ee730a2599fc439c9')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_61','It Ain’t Right','PiSk','OST',5, '14b8b76b9b9da4716842360e49ac270e8f5ecca186e1d86b1c4f3fa39c7135e1')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_62','I Loved You Then','Luke & The Belleville Orchestra','OST',5, '678927bf83ca7ea4b77e75edc67837eb8d0e6d41d8fe4dca06d3b2ecb0774c38')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_63','Delight','Jamie Berry ft. Octavia Rose','OST',5, 'd5dd156ab9310c9d7cec234fab244d4810f97a4421751dbf725e4854df340533')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_64','Light Up The Night','Jamie Berry (feat. Octavia Rose)','OST',5, 'eacc51d575bbb7f4cbee428da28af8db31d8850d5b6637200de2a385bd285a13')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_65','Take That','RIOT','OST',5, '4af46c6b5ce3dd3a5cce76d7005afd4f9643d3696222d38b6c6ca1b26a8200d1')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_66','Eden','Au5 & Danyka Nadeau','OST',5, '155ef14915ed9799820575860d20a0b0d1f87470ffaf3315bc0765349a096f21')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_67','TURBO','Tokyo Machine','OST',5, 'd7df8f56d5fe9c20c71057ea3a861680891b0c656798b5b8a30845908d4d12ae')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_68','MOSHI','Pegboard Nerds & Tokyo Machine','OST',5, 'cb905ab995bc29bc1892172c9cac2fcf46a66134ae78ae70fbf4bd69ec95db98')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_69','New Game','Nitro Fun','OST',5, '37d75c3817502ae1e87247cbf8966b867ca80d4ab52fb4bfafb481cef5e4886f')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_70','Cyberpunk (Synth Riders Edition)','Extra Terra','OST',5, 'd257ed4b519d895cee2e7a8ca7c0367a68f5a9ab11cfc3363593a0cf79a10560')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_71','Takeover','Zardonic','OST',5, 'c9a88b175928182ddb52885131782144846790f271eff88fee1b5468e20bcfa7')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_72','Voidwalkers','Au5 & Chime','OST',5, 'cb17d9abc940892b14aa62f669751a35a29eabc2a35bf9eba6ef78c7df42f008')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_73','I’ll Fight Back','Sullivan King','OST',5, 'c3be89c6a5feb01eddf45c89fb2db0140a1f33a761bfb762f61ad24afa33c9c8')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_74','Calling Out','MUZZ (feat. KG & Skyelle)','OST',5, 'c2cba18813708752773d83f316c47d5272492adbc12693fc9edd657edcbce63c')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_75','Showdown','F.O.O.L.','OST',5, 'feffefe96b096abb7a1a3315830f74db893522a7f3b098b73722dad6ffaa186c')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_76','Carry On','F.O.O.L.','OST',5, '691dbcd87426e8ddd04421cd756198c81564d072101ac4c40db83b6c91dc7327')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_77','Revenger','F.O.O.L.','OST',5, 'aa44e640988674605f891b8eac9e323303ddf9afb3097b21111e750509523be4')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_78','Self Esteem','The Offspring','OST',5, 'd434a61ad053bd3e23fc91ed5c4983123b44cc0a8c22526953c16b7bc9e66bf3')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_79','Come Out And Play','The Offspring','OST',5, '3b7adc5e1eb5275a67391d5bd9a88e0b2109110cfacd6dfeb02c8d8aa8ab4742')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_80','Time Bomb','Rancid','OST',5, '4ca476d91faa1f4ffbf1a5bda9fb9b64f3152d802b65e74878b3659204191674')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_81','21st Century (Digital Boy)','Bad Religion','OST',5, '2958faebc727a828b2ed53a1b404ea8efc2ad83d03a7b73d584fb7891b209d99')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_82','Gave You Everything','The Interrupters','OST',5, 'ea9cb14fc4dff4e38e48188dce24f71b82dac29968ba1de38e784ee5289ea6fd')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_83','Never Gonna Die','Pennywise','OST',5, '1053d5993fc2e19d3c698b96777cc8c24b9bf6a1f26ee924157473d9ecddccae')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_84','New Comedown','Plague Vendor','OST',5, '84b34e10e0fb5c959753314032b3e48acdef618fccc1054a82035fcafffaa4d0')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_85','Hard To Love','Too Close To Touch','OST',5, '9862d318ffbdd6baf52bcc12e97b6304d627748f5a43e242466f6ad27b626b5c')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_86','Lone Digger','Caravan Palace','OST',5, '5b3a6488261ce92f2b93459035b5e32ae6898fb989e7fa6da88aacbd7122156d')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_87','Rock It For Me','Caravan Palace','OST',5, '65ad8e7cab65c70bc6ca5c4a1e61a04af6eca95c9fb035681604305823171218')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_88','Wonderland','Caravan Palace','OST',5, 'b2fe53982b3d539f112fa7c87f79497f501638608969bcfd7420ebe76a277705')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_89','Tattoos','Caravan Palace','OST',5, '0365ef02c0df9e049a34245ea76fbc675b7f924b68ffcd0cc140844981f11014')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_90','Miracle','Caravan Palace','OST',5, 'f72e980655f73c683428e0acb1ef4b283e343e6d43705febbeeed78c9c46e159')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_91','Starlight','Muse','OST',5, '971eecfd620f535c8c701b45673fb7dd064a330c80ff43d7052a59724e0b6259')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_92','Pressure','Muse','OST',5, '911d00e5ccd294525ba778b6bba402b25ea05a9ac150d184dcef36eda27f70c1')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_93','Reapers','Muse','OST',5, '590c1f5aab639208ac6cfc2be759bb95ceb4ff9f2925fd30e9799c388f26bbd2')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_94','Uprising','Muse','OST',5, '1fdd0ec1866368634c79677a46697f9bd925a001db8ea5b2d76cebb40b0894de')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_95','Madness','Muse','OST',5, 'cc96d6fa4b654f11d05780b8b6a01cf2be48993142b04b5f040e71fe436bcaec')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_96','Underground','Lindsey Stirling','OST',5, 'd1acb60a5d83a90aca7faa28d9cbad3a60d3371985124190fdb5f8aa27298636')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_97','Shatter Me (feat. Lzzy Hale)','Lindsey Stirling','OST',5, '3f6e60dbc62fffbb9d6c99c0d7d65d2aff8e67403cbb4eac248ebffeec2e192a')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_98','First Light','Lindsey Stirling','OST',5, 'c8645adea550ca47e2681e093ff05b2c0d9743cbebcff6554e18f79562fcb6d2')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_99','Mirage (feat. Raja Kumari)','Lindsey Stirling','OST',5, '285ca847003c79a381126c4410546629620dbaa5ea2e7c283c44d5326b2fc0f5')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_100','Shadows','Lindsey Stirling','OST',5, 'ee2b46bbdc038e3c1c969c306fed6d9a6a9c7ea9bff8dc33aa5eafa278dc9d5b')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_101','Legends Never Die','League of Legends & Against The Current','OST',5, 'db5c6d495d160f6a2ebcad1082affa4661fdba87d44c881e3cee0ff4dd77f7d9')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_102','POP/STARS','K/DA (feat. Madison Beer, (G)I-DLE & Jaira Burns)','OST',5, '43aa4edab3d31145b44d198ecf6747da4c589d0d4b61c5353c5a84e41bf13c1c')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_103','MORE','K/DA (feat. Madison Beer, (G)I-DLE, Lexie Liu, Jaira Burns, Seraphine)','OST',5, '82a516a999954c6b7f6b3884b464dc8f76a7b3e12d64a8f2725c206659a6679c')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_104','GIANTS','True Damage (feat. Becky G., Keke Palmer, SOYEON, DUCKWRTH, Thutmose)','OST',5, 'bc253f72f14a37f0fb4b65e783dca611bc5a86cba357a1572ea7206f35481914')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_105','Awaken','League of Legends (feat. Valerie Broussard & Ray Chen)','OST',5, 'de507e33879d1c4739585ce4d968a76bce1b3e8c218483ca3151a3a3c1519868')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_106','24K Magic','Bruno Mars','OST',5, 'f21a31dcd2a6b42eb035c554a57505b11f91cece8646bfcfced6669de70c5d2b')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_107','Runaway Baby','Bruno Mars','OST',5, '23207d13d424bf13f92abc49588843d1c52c9a5aa5a20d6133c426731045a1e8')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_108','Skate','Silk Sonic (feat. Bruno Mars & Anderson .Paak)','OST',5, '7e15f832bf12630c453b6f1c51822e53f56a39ff3a074f4b1e2464a90ab6c659')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_109','Manuals','Starcadian','OST',5, '3e39710537c846a73d4d6e79a65c86f33a3e0a27bcb5f7af182d9ba032165c76')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_110','Supersymmetry','Starcadian','OST',5, '9aad93386ebe5b143b540b3e5033a86ba8411116d8e7ba88faed892b23bd4c35')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_111','Feel Good Inc','Gorillaz','OST',5, '16a8cc34eb0b4d6f4c9e0f38d5a8ab3b80a31268c5f25c78665e128161ddbb61')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_112','Clint Eastwood','Gorillaz','OST',5, 'e7ecd64ab47d5e649628b0425649eaff17eefacdb25a822c43febb582b93e6e4')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_113','New Gold (feat. Tame Impala and Bootie Brown)','Gorillaz','OST',5, '8be8f9f51bc6325679e58cf14e3cff29f61621cb05b3006ff4c4f0146762e40f')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_114','Dare','Gorillaz','OST',5, '35d08996bff8b6768ec3d87fd5d9b9fe344a77bde57a04290e959fcf584880e6')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_115','On Melancholy Hill','Gorillaz','OST',5, '64f83c45c666d1f0bc6b7f050efb110f7a067f2f9dac97d26e9263ede7221503')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_116','Cracker Island (feat. Thundercat)','Gorillaz','OST',5, '36858b79c6a64069fa272284586f62a06867971604d1bcf3ade49b3605e6e0a4')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_117','Sleeping Powder','Gorillaz','OST',5, '555161c511a9392133fd7d11301c0bfcb7b5aa0c3ccd16cb940228acd1798aa3')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_118','We Were Young','PRIZM','OST',5, 'c5cc9c403e26096ecb5c50a6f2253d0ee04665777250222bc699ff3e5b54fc09')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_119','Rendezvous (VHS Dreams Remix)','Scandroid','OST',5, '9e541b1031cc7b0cfc6ca3bf1e547325b8a9fafa4ec1f0fdf91e36267ebfdda6')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_120','Sledge','Dance With The Dead','OST',5, '28677cb8d0c8439ea16bb8ff185a58d54f6065b2094d7e14ec34a1a8338959b0')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_121','A Matter of Time','Ollie Wride','OST',5, '55be82c9213af8a4951f747f9c31a3971b3241fa3431d66a8128bad2d9c32c3d')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_122','Interstellar','LeBrock','OST',5, '3118c7d2f9ebcd773193a6a8fdae7ce040bcaaa2be9c120edbd63850a4a2600a')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_123','Blue Monday (Synth Riders version)','Zardonic (feat. REEBZ)','OST',5, 'deeb421010459dbac1c91c2d2d67026f64f4a5cbb9114a2d6d11d17abac624ba')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_124','Jason','The Midnight (feat. Nikki Flores)','OST',5, 'f389ee3ba54ca374abc2209dbc02680cc37eebc649b11f913ece381d99fa3c78')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_125','Sunset','The Midnight','OST',5, 'be50ffcf592475bf0c1b9dc61777450cd9071c3c6a4a87df36a64a0dda2a0d3e')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_126','New Cydonia','Starcadian (feat. Hayley)','OST',5, '5bdf3738887d64b35b1b4b8e945b26477f9463d930494545bddf8191ed507fbe')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_127','Behemoth (Perturbator Remix)','GoST','OST',5, 'a4eb94ec4001629c19a3cd3ae84b1c9c389161c34cf32996841b8fa6ec3314b6')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_128','Keep You in Line','Jamie Berry (feat. Cissie)','OST',5, 'fbc6bfb2bd50d0707680a9bf51e5e549e991694ce7c9ac3e9c03d85ff5d7a381')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_129','Keep on Smilin','Wolfgang Lohr (feat. Emma Lea & Ashley Slater)','OST',5, '20d69eec4ad754aafffca00f1bd024f43dd09e663f5cbf49844ddd240ae24a76')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_130','Watch Your Tongue','PiSk','OST',5, '809dd42f7e6669c95f1aa57286b5b977172c21d75a8d368352253eeb50e3c441')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_131','Silent Movie','Little Violet','OST',5, '17b642251200bd3ea7a44e65a5a752cb0bcd2871e9f1230a45c24bfaca47a4f6')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_132','Guilty Pleasure','Jamie Berry (feat. Little Violet)','OST',5, '007540449d2e75a3173a002404673542b2ee74ac4486e43d37c5215c37527a47')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_133','Boring 20s','Tamela D’Amico','OST',5, '1a494d6613b2970e836b5bdfd157248fb95888d5053412a1801e76c7448d0e28')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_134','Magic Man','Balduin & Wolfgang Lohr (feat. J Fitz)','OST',5, 'a9b9bc32776facb4a77224f064809e5a83dba9515d28d11c6dafbbfc078d3a9a')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_135','Let’s Start Again (Odd Chap Remix)','Cut Capers','OST',5, 'a793dd476848b61f8faf1cb2cbdd44d0ffb6481ae3dfc44acd66ede87a39ecfd')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_136','Rose','Swingrowers','OST',5, 'c81db9c8b734be5699263d3963edfbf2f023ec682448d8cdb0e27eb6876c6bad')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_137','Take On Me','a-ha','OST',5, '7664ca545c13861e3a46cd384ec2dbed96b34ff83dd3d088108c7e05f50dfcc6')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_138','Whip It','Devo','OST',5, '66522560f30411abcede77aa2acabb6c6d0860f44eceaa144fb5d192500a4172')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_139','We Built This City','Starship','OST',5, '301ff58ae864b4f716bf707e89ed095c98b7a3cd2de7d9859deb195e0191ee6c')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_140','Sussudio','Phil Collins','OST',5, '74e0176d99c412650c67f9e5c9c1c5c6b54fd4b7272eb6734ee15c8d3d808362')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_141','New Sensation','INXS','OST',5, '5472a3ac6518e9fd59c341a26bc00146f899d1783442bdf0657f67f5e5e93dc8')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_142','Don’t Stop Me Now','Queen','OST',5, 'd57f7937a05b3dd2f606f821ff9f0525e4fc4f4d1bb2857c17cba83eb719900f')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_143','Wake Me Up Before You Go-Go','Wham!','OST',5, 'd1a703af0bafa34324908337186488a45263606765b79ef2a25ae9447cd7b85f')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_144','Africa','Toto','OST',5, '52095dfb0b19f14979b50f519cc47d567d5fd2ddb238fc1784e018c15921ef01')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_145','Don’t You (Forget About Me)','Simple Minds','OST',5, '2a6ccef0fa23ec22ab717bdb27b59fa47532d382868dc2e514db88c07b269865')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_146','Just Like Heaven','The Cure','OST',5, '980512b9b52d91add7390ed5bb54d727669335182ec58431e33834994ce823aa')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_147','Out of Touch','Daryl Hall & John Oates','OST',5, '17bcebe627410b10c20bcc17940c2ced650bbf95e089edc04e267ee665fd3182')`
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", "title", "artist", "mapper", "gameId", "dataSignature") VALUES ('SR_OST_148','Never Gonna Give You Up','Rick Astley','OST',5, 'dd4eb884bf20ad5e5d9b946e2644fd507f032f051be7ca9c9a6bfc34750b8609')`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM song WHERE "songHash" like 'SR_OST_%'`
    );
    await queryRunner.query(
      `ALTER TABLE "song" DROP CONSTRAINT "UQ_e72403483b36250c803242a3582"`
    );
    await queryRunner.query(
      `ALTER TABLE "song" ADD CONSTRAINT "UQ_4f2e03f5d2c2e196a9066538511" UNIQUE ("songHash")`
    );
  }
}
