import { Injectable, Logger } from '@nestjs/common';
import { SongImporter } from './song-importer.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from '../../../data-store/entities/game.entity';
import { Repository } from 'typeorm';
import { SongService } from '../song.service';
import * as fs from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { ModIoApiService } from '../mod-io-api.service';
import { ZipFileExtractorService } from '../zip-file-extractor.service';

@Injectable()
export class PistolWhipSongImporterService implements SongImporter {
  private logger: Logger = new Logger(this.constructor.name);

  constructor(
    @InjectRepository(Game) private gameRepository: Repository<Game>,
    private songService: SongService,
    private modIoApiService: ModIoApiService,
    private zipFileExtractorService: ZipFileExtractorService
  ) {}

  gameName = 'pistol_whip';

  async importSongs(): Promise<number> {
    const game = await this.gameRepository.findOneBy({ name: this.gameName });
    let songCount = 0;

    let data;
    try {
      data = await this.modIoApiService.getModsForGame(4407);
    } catch (e) {
      this.logger.error('getModsForGame failed', { error: e.message });

      return 0;
    }

    const songHashes = await this.songService.getSongHashesAndDataSignatures(
      game
    );

    for (const dataPage of data) {
      for (const dataItem of dataPage.data) {
        if (!songHashes.has(dataItem.id.toString())) {
          const importResult = await this.downloadAndImportSong(
            game,
            dataItem.id,
            dataItem.modfile.download.binary_url,
            dataItem.name,
            dataItem.submitted_by.username
          );

          if (importResult) {
            songCount++;
          } else {
            this.logger.warn('Failed to import song', {
              id: dataItem.id,
              name: dataItem.name,
              zipFile: dataItem.modfile.download.binary_url,
            });
          }
        }
      }
    }

    return songCount;
  }

  private async downloadAndImportSong(
    game: Game,
    modId: number,
    downloadUrl: string,
    modName: string,
    modSubmitter: string
  ): Promise<boolean> {
    // Set defaults in case we can't download or can't process the zip file
    let artist: string | null = null;
    let bpm: number | null = null;
    let duration: number | null = null;
    let fileReference: string | null = null;

    this.logger.log('Downloading ' + downloadUrl);

    // Create a work dir to do our stuff
    const workDir = fs.mkdtempSync(join(tmpdir(), 'requesto-'));
    const zipPath = join(workDir, 'download.zip');
    await this.modIoApiService.downloadModFile(downloadUrl, zipPath);

    // Unzip file - just need the level.pw file inside
    const levelDataRaw = await this.zipFileExtractorService.getFileFromZip(
      zipPath,
      'level.pw'
    );
    if (levelDataRaw === null) {
      this.logger.warn(
        'Unable to find level.pw in zip file, proceeding with null for artist, bpm, duration and fileReference',
        {
          modId: modId,
          title: modName,
          mapper: modSubmitter,
        }
      );
    } else {
      let levelData;

      try {
        levelData = JSON.parse(levelDataRaw);
      } catch (e) {
        this.logger.warn('Failed to parse level data JSON', {
          error: e.message,
          modId: modId,
          title: modName,
          mapper: modSubmitter,
        });
      }

      if (levelData) {
        artist = levelData.songArtist;
        bpm = Math.floor(parseInt(levelData.tempo));
        duration = Math.floor(parseInt(levelData.songLength));
        fileReference = levelData.maps[0];

        if (isNaN(bpm)) {
          bpm = null;
        }

        if (isNaN(duration)) {
          duration = null;
        }
      }
    }

    await this.songService.saveSong(
      this.songService.createSongEntity(
        game,
        modName,
        artist,
        // Using the submitter username from mod.io - the song data itself does not seem to
        // be reliable for this
        modSubmitter,
        modId.toString(),
        downloadUrl,
        bpm,
        duration,
        fileReference
      )
    );
    // Remove the zip since we're done with it.
    fs.unlinkSync(zipPath);

    return true;
  }
}
