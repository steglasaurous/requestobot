import { Module } from '@nestjs/common';
import { QueueGateway } from './gateways/queue.gateway';
import { DataStoreModule } from '../data-store/data-store.module';
import { SongRequestModule } from '../song-request/song-request.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [DataStoreModule, SongRequestModule, EventEmitterModule],
  providers: [QueueGateway],
})
export class WebsocketModule {}
