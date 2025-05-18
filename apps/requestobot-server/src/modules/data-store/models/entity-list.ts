import { Channel } from '../entities/channel.entity';
import { Game } from '../entities/game.entity';
import { Song } from '../entities/song.entity';
import { SongRequest } from '../entities/song-request.entity';
import { SongBan } from '../entities/song-ban.entity';
import { UserBotState } from '../entities/user-bot-state.entity';
import { User } from '../entities/user.entity';
import { UserAuthSource } from '../entities/user-auth-source.entity';
import { Setting } from '../entities/setting.entity';
import { SettingDefinition } from '../entities/setting-definition.entity';
import { UserRefreshToken } from '../entities/user-refresh-token.entity';
import { Player } from '../entities/player.entity';

export const entityList = [
  Channel,
  Game,
  Song,
  SongRequest,
  SongBan,
  UserBotState,
  User,
  UserAuthSource,
  Setting,
  SettingDefinition,
  UserRefreshToken,
  Player,
];
