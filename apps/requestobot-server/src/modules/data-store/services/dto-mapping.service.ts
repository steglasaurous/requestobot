import { Injectable } from '@nestjs/common';
import { SongRequest } from '../entities/song-request.entity';
import { Channel } from '../entities/channel.entity';
import {
  SongRequestDto,
  SongDto,
  ChannelDto,
  GameDto,
  SettingDto,
} from '@requestobot/util-dto';
import { Game } from '../entities/game.entity';
import { Song } from '../entities/song.entity';
import { Setting } from '../entities/setting.entity';

@Injectable()
export class DtoMappingService {
  public songRequestToDto(songRequest: SongRequest): SongRequestDto {
    const songDto: SongDto = this.songToDto(songRequest.song);

    return {
      id: songRequest.id,
      song: songDto,
      requesterName: songRequest.requesterName,
      requestOrder: songRequest.requestOrder,
      requestTimestamp: songRequest.requestTimestamp.valueOf(),
      isActive: songRequest.isActive,
      isDone: songRequest.isDone,
    } as SongRequestDto;
  }

  public async channelToDto(channel: Channel): Promise<ChannelDto> {
    const gameDto: GameDto = this.gameToDto(channel.game);
    const settingsDtos: SettingDto[] = [];
    const channelSettings = await channel.settings;
    if (channelSettings) {
      for (const setting of channelSettings) {
        settingsDtos.push(this.settingToDto(setting));
      }
    }

    return {
      game: gameDto,
      id: channel.id,
      channelName: channel.channelName,
      chatServiceName: channel.chatServiceName,
      inChannel: channel.inChannel,
      enabled: channel.enabled,
      queueOpen: channel.queueOpen,
      settings: settingsDtos,
    } as ChannelDto;
  }

  public gameToDto(game: Game): GameDto {
    return {
      id: game.id,
      name: game.name,
      displayName: game.displayName,
      setGameName: game.setGameName,
      twitchCategoryId: game.twitchCategoryId,
      coverArtUrl: game.coverArtUrl,
    };
  }

  public songToDto(song: Song): SongDto {
    return {
      id: song.id,
      title: song.title,
      artist: song.artist,
      songHash: song.songHash,
      mapper: song.mapper,
      bpm: song.bpm,
      duration: song.duration,
      downloadUrl: song.downloadUrl,
      fileReference: song.fileReference,
      gameName: song.game.name,
      coverArtUrl: song.coverArtUrl,
    };
  }

  public settingToDto(setting: Setting): SettingDto {
    return {
      channelId: setting.channel.id,
      settingName: setting.settingName.name,
      value: setting.value,
    };
  }
}
