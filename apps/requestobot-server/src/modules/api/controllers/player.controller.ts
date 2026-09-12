import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Put,
  Req,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { PlayerDto } from '../dto/player.dto';
import { DtoMappingService } from '../../data-store/services/dto-mapping.service';
import { PlayerService } from '../../data-store/services/player.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChannelManagerService } from '../../channel-manager/services/channel-manager.service';
import { Song } from '../../data-store/entities/song.entity';
import { ApiCookieAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('api/channels/:channelId/player')
export class PlayerController {
  constructor(
    private dtoMappingService: DtoMappingService,
    private playerService: PlayerService,
    private channelManager: ChannelManagerService,
    @InjectRepository(Song) private songRepository: Repository<Song>
  ) {}

  @ApiOperation({
    summary: 'Get player state',
    tags: ['Player'],
  })
  @ApiCookieAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Get('/state')
  async getPlayerState(
    @Param('channelId') channelId: number
  ): Promise<PlayerDto> {
    const channel = await this.channelManager.getChannelById(channelId);
    if (!channel) {
      throw new NotFoundException(`channelId ${channelId} does not exist`);
    }

    const player = await this.playerService.getPlayer(channel);

    return this.dtoMappingService.playerToDto(player);
  }

  @ApiOperation({
    summary: 'Put player state',
    tags: ['Player'],
  })
  @ApiCookieAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Put('/state')
  async putPlayerState(
    @Param('channelId') channelId: number,
    @Body() playerDto: PlayerDto,
    @Req() request: Request
  ): Promise<PlayerDto> {
    const channel = await this.channelManager.getChannelById(channelId);
    if (!channel) {
      throw new NotFoundException(`channelId ${channelId} does not exist`);
    }

    if (channel.channelName != request['user'].username) {
      throw new BadRequestException(
        'Only broadcasters can modify their channels'
      );
    }

    const player = await this.playerService.getPlayer(channel);

    if (playerDto.state != player.state) {
      player.state = playerDto.state;
    }
    if (playerDto.songId && playerDto.songId != player.song.id) {
      const song = await this.songRepository.findOneBy({
        id: playerDto.songId,
      });
      if (!song) {
        throw new UnprocessableEntityException(
          `songId ${playerDto.songId} does not exist`
        );
      }
      player.song = song;
    }

    if (playerDto.volume && player.volume != playerDto.volume) {
      player.volume = playerDto.volume;
    }

    await this.playerService.savePlayer(player);

    return this.dtoMappingService.playerToDto(player);
  }
}
