import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from '../../data-store/entities/game.entity';
import { Repository } from 'typeorm';
import { GameDto } from '../dto/game.dto';
import { DtoMappingService } from '../../data-store/services/dto-mapping.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('api/games')
export class GameController {
  constructor(
    @InjectRepository(Game) private gameRepository: Repository<Game>,
    private dtoMappingService: DtoMappingService,
  ) {}

  @ApiOperation({
    description: 'Get a list of supported games',
    tags: ['Game'],
  })
  @Get()
  async getGames(): Promise<GameDto[]> {
    const games = await this.gameRepository.find();
    const dtoOutput: GameDto[] = [];
    for (const game of games) {
      dtoOutput.push(this.dtoMappingService.gameToDto(game));
    }

    return dtoOutput;
  }
}
