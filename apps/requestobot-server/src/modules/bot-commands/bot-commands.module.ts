import { Module } from '@nestjs/common';
import { JoinChannelBotCommand } from './commands/join-channel.bot-command';
import { BotCommandListener } from './listeners/bot-command.listener';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataStoreModule } from '../data-store/data-store.module';
import { Channel } from '../data-store/entities/channel.entity';
import { BotStateService } from '../data-store/services/bot-state.service';
import { SongRequestBotCommand } from './commands/song-request.bot-command';
import { SongStoreModule } from '../song-store/song-store.module';
import { JoinChannelsOnConnectListener } from './listeners/join-channels-on-connect.listener';
import { SongRequestModule } from '../song-request/song-request.module';
import { NextSongBotCommand } from './commands/next-song.bot-command';
import { QueueBotCommand } from './commands/queue.bot-command';
import { OopsBotCommand } from './commands/oops.bot-command';
import { GetOutBotCommand } from './commands/get-out.bot-command';
import { SetGameBotCommand } from './commands/set-game.bot-command';
import { HttpModule } from '@nestjs/axios';
import { OffBotCommand } from './commands/off.bot-command';
import { OnBotCommand } from './commands/on.bot-command';
import { ClearBotCommand } from './commands/clear.bot-command';
import { OpenBotCommand } from './commands/open.bot-command';
import { CloseBotCommand } from './commands/close.bot-command';
import { MetricsModule } from '../metrics/metrics.module';
import {
  makeCounterProvider,
  makeGaugeProvider,
} from '@willsoto/nestjs-prometheus';
import { Metrics } from './models/metrics.enum';
import { RbsetBotCommand } from './commands/rbset.bot-command';
import { RemoveBotCommand } from './commands/remove.bot-command';
import { BanSongBotCommand } from './commands/ban-song.bot-command';
import { BanSongRemoveBotCommand } from './commands/ban-song-remove.bot-command';
import { ChannelManagerModule } from '../channel-manager/channel-manager.module';
import { MessageFormatterService } from '@steglasaurous/chat';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DataStoreModule,
    TypeOrmModule.forFeature([Channel]),
    SongStoreModule,
    SongRequestModule,
    HttpModule,
    MetricsModule,
    ChannelManagerModule,
  ],
  providers: [
    {
      provide: 'BOT_CHANNEL_NAME',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return configService.get('TWITCH_CHANNEL');
      },
    },
    JoinChannelBotCommand,
    SongRequestBotCommand,
    NextSongBotCommand,
    QueueBotCommand,
    OopsBotCommand,
    GetOutBotCommand,
    SetGameBotCommand,
    OffBotCommand,
    OnBotCommand,
    ClearBotCommand,
    OpenBotCommand,
    CloseBotCommand,
    RbsetBotCommand,
    RemoveBotCommand,
    BanSongBotCommand,
    BanSongRemoveBotCommand,
    {
      provide: 'BOT_COMMANDS',
      inject: [
        JoinChannelBotCommand,
        SongRequestBotCommand,
        NextSongBotCommand,
        QueueBotCommand,
        OopsBotCommand,
        GetOutBotCommand,
        SetGameBotCommand,
        OffBotCommand,
        OnBotCommand,
        ClearBotCommand,
        OpenBotCommand,
        CloseBotCommand,
        RbsetBotCommand,
        RemoveBotCommand,
        BanSongBotCommand,
        BanSongRemoveBotCommand,
      ],
      useFactory: (
        joinChannelBotCommand: JoinChannelBotCommand,
        songRequestBotCommand: SongRequestBotCommand,
        nextSongBotCommand: NextSongBotCommand,
        queueBotCommand: QueueBotCommand,
        oopsBotCommand: OopsBotCommand,
        getOutBotCommand: GetOutBotCommand,
        setGameBotCommand: SetGameBotCommand,
        offBotCommand: OffBotCommand,
        onBotCommand: OnBotCommand,
        clearBotCommand: ClearBotCommand,
        openBotCommand: OpenBotCommand,
        closeBotCommand: CloseBotCommand,
        rbSetCommand: RbsetBotCommand,
        removeBotCommand: RemoveBotCommand,
        banSongBotCommand: BanSongBotCommand,
        banSongRemoveBotCommand: BanSongRemoveBotCommand
      ) => {
        return [
          joinChannelBotCommand,
          songRequestBotCommand,
          nextSongBotCommand,
          queueBotCommand,
          oopsBotCommand,
          getOutBotCommand,
          setGameBotCommand,
          offBotCommand,
          onBotCommand,
          clearBotCommand,
          openBotCommand,
          closeBotCommand,
          rbSetCommand,
          removeBotCommand,
          banSongBotCommand,
          banSongRemoveBotCommand,
        ];
      },
    },
    BotCommandListener,
    BotStateService,
    JoinChannelsOnConnectListener,
    MessageFormatterService,

    makeCounterProvider({
      name: Metrics.BotCommandsExecutedTotal,
      help: 'Bot commands executed',
      labelNames: ['command', 'status', 'game'],
    }),
    makeGaugeProvider({
      name: Metrics.SongDatabaseTotal,
      help: 'Total number of songs in the database',
      labelNames: ['game'],
    }),
    makeGaugeProvider({
      name: Metrics.SongRequestsTotal,
      help: 'Total number of song requests in the database',
      labelNames: [
        'game',
        'status', // queued,current,completed
      ],
    }),
  ],
  exports: [MessageFormatterService],
})
export class BotCommandsModule {}
