import { Module } from '@nestjs/common';
import { ChannelManagerService } from './services/channel-manager.service';
import { DataStoreModule } from '../data-store/data-store.module';
import { MetricsModule } from '../metrics/metrics.module';
import {
  makeCounterProvider,
  makeGaugeProvider,
} from '@willsoto/nestjs-prometheus';
import { Metrics } from '../bot-commands/models/metrics.enum';

@Module({
  imports: [DataStoreModule, MetricsModule],
  providers: [
    ChannelManagerService,
    makeGaugeProvider({
      name: Metrics.ChannelsTotal,
      help: 'Total channels registered in the database',
    }),
    makeGaugeProvider({
      name: Metrics.ChannelsJoinedTotal,
      help: 'Total channels the bot is currently in (joined)',
    }),
    makeCounterProvider({
      name: Metrics.ChannelJoinedCounterTotal,
      help: 'Number of times a channel was joined',
      labelNames: ['join_source'],
    }),
    makeCounterProvider({
      name: Metrics.ChannelLeftCounterTotal,
      help: 'Number of times a channel was left',
    }),
    makeGaugeProvider({
      name: Metrics.ChannelsBotEnabledTotal,
      help: 'Number of channels where the bot is marked as enabled',
    }),
  ],
  exports: [ChannelManagerService],
})
export class ChannelManagerModule {}
