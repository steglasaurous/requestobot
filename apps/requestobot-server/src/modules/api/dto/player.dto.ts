import { PlayerState } from '../../data-store/models/player-state.enum';
import { ApiProperty } from '@nestjs/swagger';

export class PlayerDto {
  @ApiProperty()
  songId?: number;
  @ApiProperty({ type: 'string', enum: PlayerState })
  state: PlayerState;

  @ApiProperty({ description: 'Volume from 0 to 100' })
  volume?: number;
}
