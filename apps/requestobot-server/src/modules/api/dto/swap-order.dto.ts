import { ApiProperty } from '@nestjs/swagger';

export class SwapOrderDto {
  @ApiProperty({ description: 'The target songRequestId to swap order with' })
  songRequestId: number;
}
