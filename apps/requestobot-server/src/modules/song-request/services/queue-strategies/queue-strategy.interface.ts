import { Channel } from '../../../data-store/entities/channel.entity';
import { SongRequest } from '../../../data-store/entities/song-request.entity';

export interface QueueStrategy {
  /**
   * Should return what the order of the song request should be when inserted into the request queue.
   *
   * @param channel
   * @param songRequest
   */
  setNextOrder(
    channel: Channel,
    songRequest: SongRequest,
  ): Promise<SongRequest>;

  /**
   * Gets the strategy name that matches what would be stored in the database (e.g. 'fifo')
   */
  getStrategyName(): string;
}
