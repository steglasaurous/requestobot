import { Injectable, Logger } from '@nestjs/common';
import { SongImporter } from './song-importer.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from '../../../data-store/entities/game.entity';
import { Repository } from 'typeorm';
import { SongService } from '../song.service';
import { HttpService } from '@nestjs/axios';

// Z API documented here: https://synthriderz.com/api
@Injectable()
export class SynthRiderzSongImporterService implements SongImporter {
  gameName: 'synth_riders';
  private logger: Logger = new Logger(this.constructor.name);
  private baseUrl = 'https://synthriderz.com';

  constructor(
    @InjectRepository(Game) private gameRepository: Repository<Game>,
    private songService: SongService,
    private readonly httpService: HttpService
  ) {}

  async importSongs(): Promise<number> {
    const game = await this.gameRepository.findOneBy({ name: 'synth_riders' });
    const songHashes = await this.songService.getSongHashesAndDataSignatures(
      game
    );

    return new Promise<number>((resolve, reject) => {
      this.httpService
        .get(`${this.baseUrl}/api/beatmaps?sortBy=published_at,DESC`)
        .subscribe({
          next: async (response) => {
            let importedSongCount = 0;

            for (const parsedSong of response.data) {
              const durationSplit = parsedSong.duration.split(':');
              const duration =
                parseInt(durationSplit[0]) * 60 + parseInt(durationSplit[1]);

              const song = this.songService.createSongEntity(
                game,
                parsedSong.title,
                parsedSong.artist,
                parsedSong.mapper,
                parsedSong.hash,
                `${this.baseUrl}${parsedSong.download_url}`,
                parseInt(parsedSong.bpm),
                duration,
                parsedSong.filename,
                `${this.baseUrl}${parsedSong.cover_url}`
              );

              if (songHashes.has(parsedSong.hash)) {
                if (songHashes.get(parsedSong.hash) === song.dataSignature) {
                  // Nothing's changed, so move on to the next row.
                  continue;
                }
              }
              await this.songService.saveSong(song);
              importedSongCount++;
            }
            resolve(importedSongCount);
          },
          error: (err) => {
            this.logger.warn(
              'Request to synthriderz api failed: ' + err.toString()
            );
            resolve(0);
          },
        });
    });
  }
}
