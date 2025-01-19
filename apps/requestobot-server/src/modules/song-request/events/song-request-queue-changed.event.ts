import { Channel } from '../../data-store/entities/channel.entity';
import { SongRequest } from '../../data-store/entities/song-request.entity';

export class SongRequestQueueChangedEvent {
  channel: Channel;
  songRequests: SongRequest[];
}
