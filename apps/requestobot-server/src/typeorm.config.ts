import { config } from 'dotenv';
config();

import { DataSourceOptions } from 'typeorm';
import { Channel } from './modules/data-store/entities/channel.entity';

import { Game } from './modules/data-store/entities/game.entity';
import { Song } from './modules/data-store/entities/song.entity';
import { SongRequest } from './modules/data-store/entities/song-request.entity';

import { UserBotState } from './modules/data-store/entities/user-bot-state.entity';
import { User } from './modules/data-store/entities/user.entity';
import { UserAuthSource } from './modules/data-store/entities/user-auth-source.entity';
import { Migration1703611705901 } from './migrations/1703611705901-migration';
import { InitialStaticDataMigration1703611705901 } from './migrations/1703611705901-initial-static-data-migration';
import { Migration1703732675188 } from './migrations/1703732675188-migration';
import { Migration1703793463813 } from './migrations/1703793463813-migration';
import { Migration1703896119654 } from './migrations/1703896119654-migration';
import { Setting } from './modules/data-store/entities/setting.entity';
import { SettingDefinition } from './modules/data-store/entities/setting-definition.entity';
import { Migration1707708934544 } from './migrations/1707708934544-migration';
import { Migration1709249266296 } from './migrations/1709249266296-migration';
import { Migration1709249266297 } from './migrations/1709249266297-migration';
import { Migration1709865668612 } from './migrations/1709865668612-migration';
import { Migration1709872065282 } from './migrations/1709872065282-migration';
import { Migration1709872297346 } from './migrations/1709872297346-migration';
import { Migration1712350029931 } from './migrations/1712350029931-migration';
import { SongBan } from './modules/data-store/entities/song-ban.entity';
import { Migration1712701179751 } from './migrations/1712701179751-migration';
import { Migration1719683478090 } from './migrations/1719683478090-migration';
import { UserRefreshToken } from './modules/data-store/entities/user-refresh-token.entity';
import { Migration1721952141794 } from './migrations/1721952141794-migration';
import { Migration1729968981299 } from './migrations/1729968981299-migration';
import { Migration1734838703767 } from './migrations/1734838703767-migration';
import { Migration1736277542330 } from './migrations/1736277542330-migration';
import { Migration1738416054868 } from './migrations/1738416054868-migration';
import { Migration1742419946333 } from './migrations/1742419946333-migration';

export const typeORMAppConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT ?? '3306'),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [
    Channel,
    Game,
    Song,
    SongRequest,
    SongBan,
    UserBotState,
    User,
    UserAuthSource,
    Setting,
    SettingDefinition,
    UserRefreshToken,
  ],
  migrations: [
    Migration1703611705901,
    InitialStaticDataMigration1703611705901,
    Migration1703732675188,
    Migration1703793463813,
    Migration1703896119654,
    Migration1707708934544,
    Migration1709249266296,
    Migration1709249266297,
    Migration1709865668612,
    Migration1709872065282,
    Migration1709872297346,
    Migration1712350029931,
    Migration1712701179751,
    Migration1719683478090,
    Migration1721952141794,
    Migration1729968981299,
    Migration1734838703767,
    Migration1736277542330,
    Migration1738416054868,
    Migration1742419946333,
  ],
  migrationsRun: true,
};
