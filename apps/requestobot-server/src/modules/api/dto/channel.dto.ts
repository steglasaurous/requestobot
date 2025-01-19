import { GameDto } from '@requestobot/util-dto';
import { ChannelDto as ChannelDtoInterface } from '@requestobot/util-dto';
import { ApiProperty } from '@nestjs/swagger';
import { ChatServiceName } from '@steglasaurous/chat';

export class ChannelDto implements ChannelDtoInterface {
  @ApiProperty({ description: 'Requestobot channel id' })
  id: number;

  @ApiProperty({ description: 'The twitch channel name' })
  channelName: string;

  @ApiProperty({
    description: 'The chat service this channel is for. Defaults to twitch.',
  })
  chatServiceName: ChatServiceName;
  @ApiProperty({
    description:
      'Indicates whether the bot is, or should be, present in this channel. If false, the bot will leave if present and not join this channel on restart. True will have the bot join the channel.',
  })
  inChannel: boolean;
  @ApiProperty({
    description:
      'Indicates whether the bot is enabled or not in the channel (using !requestobot off or !requestobot on)',
  })
  enabled: boolean;
  @ApiProperty({
    description: 'Indicates whether the queue is taking requests',
  })
  queueOpen: boolean;
  @ApiProperty({
    description:
      'The game the bot is currently set to search requests against.',
  })
  game: GameDto;
}
