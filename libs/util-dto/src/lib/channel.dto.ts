import { GameDto } from './game.dto';
import { SettingDto } from './setting.dto';

export interface ChannelDto {
  id: number;
  channelName: string;
  inChannel: boolean;
  enabled: boolean;
  queueOpen: boolean;
  game: GameDto;
  // NOTE: Defining this explicitly instead of pulling in the enum from @steglasaurous/chat
  // so it can work in the client as well as the server.
  // See chat-service-name.enum.ts in util-chat for the enum
  chatServiceName: 'twitch' | 'test-external' | 'test-internal';
  settings?: SettingDto[];
}
