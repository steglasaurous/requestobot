import { SongRequestDto } from './song-request.dto';

export interface QueueDto {
  channelName: string;
  gameDisplayName: string;
  songRequests: SongRequestDto[];
}
