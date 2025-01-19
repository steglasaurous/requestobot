import { Injectable, Logger } from '@nestjs/common';
import { SongImporter } from './song-importer.interface';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from '../../../data-store/entities/game.entity';
import { Repository } from 'typeorm';
import { SongService } from '../song.service';
import { TrippyTunesApiService } from '../trippy-tunes-api.service';

@Injectable()
export class AudioTripSongImporterService implements SongImporter {
  gameName = 'audio_trip';

  private logger: Logger = new Logger(this.constructor.name);

  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Game) private gameRepository: Repository<Game>,
    private songService: SongService,
    private trippyTunesApiService: TrippyTunesApiService
  ) {}
  async importSongs(): Promise<number> {
    let songCount = 0;

    const game = await this.gameRepository.findOneBy({ name: this.gameName });
    const songHashes = await this.songService.getSongHashesAndDataSignatures(
      game
    );

    const trippyTunesSongList = await this.trippyTunesApiService.getSongs();
    if (trippyTunesSongList === null) {
      this.logger.warn('Failed to get songs from trippytunes');

      return 0;
    }
    for (const trippyTunePage of trippyTunesSongList) {
      for (const trippyTuneSong of trippyTunePage) {
        const song = this.songService.createSongEntity(
          game,
          trippyTuneSong.Title,
          trippyTuneSong.Artist,
          trippyTuneSong.Mapper,
          trippyTuneSong.UniqueID,
          trippyTuneSong.DownloadURL,
          parseInt(trippyTuneSong.BPM),
          parseInt(trippyTuneSong.Length),
          null,
          trippyTuneSong.CoverArt
        );

        if (songHashes.has(trippyTuneSong.UniqueID)) {
          if (songHashes.get(trippyTuneSong.UniqueID) === song.dataSignature) {
            // Nothing's changed, so move on to the next row.
            continue;
          }
        }

        try {
          await this.songService.saveSong(song, true);
        } catch (err) {
          this.logger.warn('Saving audio trip song failed', {
            err: err,
            songHash: trippyTuneSong.UniqueID,
            title: trippyTuneSong.Title,
            artist: trippyTuneSong.Artist,
            mapper: trippyTuneSong.Mapper,
          });

          continue;
        }

        songCount++;
      }
    }

    return songCount;
  }
}
