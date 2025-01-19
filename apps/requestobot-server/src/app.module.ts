import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DataStoreModule } from './modules/data-store/data-store.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BotCommandsModule } from './modules/bot-commands/bot-commands.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongStoreModule } from './modules/song-store/song-store.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { SongRequestModule } from './modules/song-request/song-request.module';
import { WebsocketModule } from './modules/websocket/websocket.module';
import { ApiModule } from './modules/api/api.module';
import { ClientLauncherModule } from './modules/client-launcher/client-launcher.module';
import * as path from 'path';
import { AuthModule } from './modules/auth/auth.module';
import { typeORMAppConfig } from './typeorm.config';
import { MetricsModule } from './modules/metrics/metrics.module';
import { UtilChatModule } from '@steglasaurous/chat';
import { ChannelManagerModule } from './modules/channel-manager/channel-manager.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DataStoreModule,
    EventEmitterModule.forRoot(),
    UtilChatModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // Detect environment.  If we're in test, setup the test chat interface.
        // Note: It seems in windows environments, the env var has some extra spaces in it.  This trims that out.
        if (configService.get('NODE_ENV').toString().trim() == 'test') {
          return {
            testClient: {
              url: 'ws://127.0.0.1:3030',
            },
            isGlobal: true,
          };
        }

        return {
          twitchConfig: {
            clientId: configService.get('TWITCH_APP_CLIENT_ID'),
            clientSecret: configService.get('TWITCH_APP_CLIENT_SECRET'),
            twitchChannel: configService.get('TWITCH_CHANNEL'),
            twitchTokenFile: configService.get('TWITCH_TOKEN_FILE'),
          },
          isGlobal: true,
        };
      },
    }),
    BotCommandsModule,
    TypeOrmModule.forRoot(typeORMAppConfig),
    ScheduleModule.forRoot(),
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
    WebsocketModule,
    ApiModule,
    ClientLauncherModule,
    AuthModule,
    MetricsModule,
    ChannelManagerModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
