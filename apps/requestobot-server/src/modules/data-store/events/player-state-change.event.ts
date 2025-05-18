import { PlayerState } from '../models/player-state.enum';
import { Song } from '../entities/song.entity';
import { Channel } from '../entities/channel.entity';

export class PlayerStateChangeEvent {
  channel: Channel;
  song: Song;
  state: PlayerState;
}
