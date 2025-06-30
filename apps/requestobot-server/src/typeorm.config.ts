import { config } from 'dotenv';
config();

import { DataSourceOptions } from 'typeorm';
import { Migration1703611705901 } from './migrations/1703611705901-migration';
import { InitialStaticDataMigration1703611705901 } from './migrations/1703611705901-initial-static-data-migration';
import { Migration1703732675188 } from './migrations/1703732675188-migration';
import { Migration1703793463813 } from './migrations/1703793463813-migration';
import { Migration1703896119654 } from './migrations/1703896119654-migration';
import { Migration1707708934544 } from './migrations/1707708934544-migration';
import { Migration1709249266296 } from './migrations/1709249266296-migration';
import { Migration1709249266297 } from './migrations/1709249266297-migration';
import { Migration1709865668612 } from './migrations/1709865668612-migration';
import { Migration1709872065282 } from './migrations/1709872065282-migration';
import { Migration1709872297346 } from './migrations/1709872297346-migration';
import { Migration1712350029931 } from './migrations/1712350029931-migration';
import { Migration1712701179751 } from './migrations/1712701179751-migration';
import { Migration1719683478090 } from './migrations/1719683478090-migration';
import { Migration1721952141794 } from './migrations/1721952141794-migration';
import { Migration1729968981299 } from './migrations/1729968981299-migration';
import { Migration1734838703767 } from './migrations/1734838703767-migration';
import { Migration1736277542330 } from './migrations/1736277542330-migration';
import { Migration1738416054868 } from './migrations/1738416054868-migration';
import { Migration1742419946333 } from './migrations/1742419946333-migration';
import { Migration1746966895500 } from './migrations/1746966895500-migration';

import { entityList } from './modules/data-store/models/entity-list';
import { Migration1747529799555 } from './migrations/1747529799555-migration';
import { Migration1747770998744 } from './migrations/1747770998744-migration';
import { Migration1747770998745 } from './migrations/1747770998745-migration';
import { Migration1751123172797 } from './migrations/1751123172797-migration';

export const typeORMAppConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT ?? '3306'),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: entityList,
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
    Migration1746966895500,
    Migration1747529799555,
    Migration1747770998744,
    Migration1747770998745,
    Migration1751123172797,
  ],
  migrationsRun: true,
};
