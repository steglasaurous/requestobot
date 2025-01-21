import { Module } from '@nestjs/common';
import { SongRequestsController } from './controllers/song-requests.controller';
import { SongRequestModule } from '../song-request/song-request.module';
import { DataStoreModule } from '../data-store/data-store.module';
import { ChannelController } from './controllers/channel.controller';
import { AuthModule } from '../auth/auth.module';
import { GameController } from './controllers/game.controller';
import { ChannelManagerModule } from '../channel-manager/channel-manager.module';
import { SettingController } from './controllers/setting.controller';
import { BotCommandsModule } from '../bot-commands/bot-commands.module';

@Module({
  imports: [
    SongRequestModule,
    DataStoreModule,
    AuthModule,
    ChannelManagerModule,
    BotCommandsModule,
  ],
  controllers: [
    SongRequestsController,
    ChannelController,
    GameController,
    SettingController,
  ],
})
export class ApiModule {}
