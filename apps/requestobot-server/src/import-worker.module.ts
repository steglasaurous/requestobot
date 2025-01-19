import { Module } from '@nestjs/common';
import { DataStoreModule } from './modules/data-store/data-store.module';
import { SongStoreModule } from './modules/song-store/song-store.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMAppConfig } from './typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DataStoreModule,
    SongStoreModule,
    TypeOrmModule.forRoot(typeORMAppConfig),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, 'i18n'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
    }),
  ],
})
export class ImportWorkerModule {}
