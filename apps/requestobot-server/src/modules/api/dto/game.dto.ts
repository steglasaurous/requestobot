import { GameDto as GameDtoInterface } from '@requestobot/util-dto';
import { ApiProperty } from '@nestjs/swagger';

export class GameDto implements GameDtoInterface {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  displayName: string;

  @ApiProperty()
  setGameName: string;

  @ApiProperty()
  twitchCategoryId: string;

  @ApiProperty()
  coverArtUrl?: string;
}
