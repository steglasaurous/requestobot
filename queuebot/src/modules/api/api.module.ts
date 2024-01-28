import { Module } from '@nestjs/common';
import { SongRequestsController } from './controllers/song-requests.controller';
import { SongRequestModule } from '../song-request/song-request.module';
import { DataStoreModule } from '../data-store/data-store.module';
import { ChannelController } from './controllers/channel.controller';

@Module({
  imports: [SongRequestModule, DataStoreModule],
  controllers: [SongRequestsController, ChannelController],
})
export class ApiModule {}
