import { Module } from '@nestjs/common';
import { GenerateJwt } from './commands/generate-jwt';
import { AuthModule } from '../auth/auth.module';
import { DataStoreModule } from '../data-store/data-store.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMAppConfig } from '../../typeorm.config';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import path from 'path';
import { SongStoreModule } from '../song-store/song-store.module';
import { SongRequestModule } from '../song-request/song-request.module';
import { LoadFixtures } from './commands/load-fixtures';

@Module({
  imports: [
    DataStoreModule,
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot(),
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
    SongStoreModule,
    SongRequestModule,
    AuthModule,
  ],
  providers: [GenerateJwt, LoadFixtures],
})
export class CliCommandsModule {}
