import {
  SongDto,
  SongRequestDto as SongRequestDtoInterface,
} from '@requestobot/util-dto';
import { ApiProperty } from '@nestjs/swagger';

export class SongRequestDto implements SongRequestDtoInterface {
  @ApiProperty()
  id: number;
  @ApiProperty()
  song: SongDto;
  @ApiProperty({ description: 'The twitch username who requested this song' })
  requesterName: string;
  @ApiProperty()
  requestTimestamp: number;
  @ApiProperty()
  requestOrder: number;
  @ApiProperty()
  isActive: boolean;
  @ApiProperty()
  isDone: boolean;
}
