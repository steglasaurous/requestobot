import { SongImporter } from './song-importer.interface';
import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from '../../../data-store/entities/game.entity';
import { Repository } from 'typeorm';
import { SongService } from '../song.service';

@Injectable()
export class SpinRhythmSongImporterService implements SongImporter {
  gameName = 'spin_rhythm';
  // FIXME: Shouldn't rely on this in perpetuity - it's marked as deprecated on the spinsha.re site.
  private spinshareSearchAllUrl = 'https://spinsha.re/api/searchAll';
  private logger: Logger = new Logger(this.constructor.name);

  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Game) private gameRepository: Repository<Game>,
    private songService: SongService
  ) {}

  async importSongs(): Promise<number> {
    let songCount = 0;

    const game = await this.gameRepository.findOneBy({ name: this.gameName });
    const songHashes = await this.songService.getSongHashesAndDataSignatures(
      game
    );
    this.logger.log('Requesting song dump from spinsha.re...');

    return new Promise<number>((resolve, reject) => {
      this.httpService.get(this.spinshareSearchAllUrl).subscribe({
        next: async (response) => {
          this.logger.log(
            `Processing ${response.data.data.songs.length} songs from spinsha.re`
          );

          for (const parsedSong of response.data.data.songs) {
            const song = this.songService.createSongEntity(
              game,
              parsedSong.title,
              parsedSong.artist,
              parsedSong.charter,
              parsedSong.id,
              parsedSong.zip,
              undefined,
              undefined,
              parsedSong.fileReference,
              parsedSong.cover
            );

            if (songHashes.has(parsedSong.id.toString())) {
              if (
                songHashes.get(parsedSong.id.toString()) === song.dataSignature
              ) {
                // Nothing's changed.
                continue;
              }
            }

            await this.songService.saveSong(song, true);
            songCount++;
          }
          resolve(songCount);
        },
        error: (e) => {
          this.logger.error('Request to spinsha.re failed', {
            error: e.message,
          });

          reject(e);
        },
      });
    });
  }
}
