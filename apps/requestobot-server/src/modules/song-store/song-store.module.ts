import { Module } from '@nestjs/common';
import { SongService } from './services/song.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataStoreModule } from '../data-store/data-store.module';
import { AudioTripSongImporterService } from './services/song-importers/audio-trip-song-importer.service';
import { HttpModule } from '@nestjs/axios';
import { SongImporterManagerService } from './services/song-importer-manager.service';
import { LocalStrategy } from './services/song-search-strategies/local.strategy';
import { SpinRhythmSearchStrategy } from './services/song-search-strategies/spin-rhythm-search.strategy';
import {
  MOD_IO_API_KEY,
  MOD_IO_BASE_URL,
  SONG_IMPORTERS,
  SONG_SEARCH_STRATEGIES,
  TRIPPY_TUNES_BASE_URL,
} from './injection-tokens';
import { SpinRhythmSongImporterService } from './services/song-importers/spin-rhythm-song-importer.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PistolWhipSongImporterService } from './services/song-importers/pistol-whip-song-importer.service';
import { ModIoApiService } from './services/mod-io-api.service';
import { DanceDashSongImporterService } from './services/song-importers/dance-dash-song-importer.service';
import { SynthRiderzSongImporterService } from './services/song-importers/synth-riderz-song-importer.service';
import { ZipFileExtractorService } from './services/zip-file-extractor.service';
import { TrippyTunesApiService } from './services/trippy-tunes-api.service';

@Module({
  imports: [
    TypeOrmModule.forFeature(),
    DataStoreModule,
    HttpModule.register({}),
    ConfigModule,
  ],
  providers: [
    SongService,
    {
      provide: MOD_IO_BASE_URL,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return configService.get('MOD_IO_BASE_URL');
      },
    },
    {
      provide: MOD_IO_API_KEY,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return configService.get('MOD_IO_API_KEY');
      },
    },
    {
      provide: TRIPPY_TUNES_BASE_URL,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return configService.get('TRIPPY_TUNES_BASE_URL');
      },
    },
    ZipFileExtractorService,
    TrippyTunesApiService,
    AudioTripSongImporterService,
    SpinRhythmSongImporterService,
    PistolWhipSongImporterService,
    DanceDashSongImporterService,
    SynthRiderzSongImporterService,
    {
      provide: SONG_IMPORTERS,
      inject: [
        AudioTripSongImporterService,
        SpinRhythmSongImporterService,
        PistolWhipSongImporterService,
        DanceDashSongImporterService,
        SynthRiderzSongImporterService,
      ],
      useFactory: (
        audioTrip: AudioTripSongImporterService,
        spin: SpinRhythmSongImporterService,
        pistolWhip: PistolWhipSongImporterService,
        danceDash: DanceDashSongImporterService,
        synthRiderz: SynthRiderzSongImporterService
      ) => {
        return [audioTrip, spin, pistolWhip, danceDash, synthRiderz];
      },
    },
    LocalStrategy,
    SpinRhythmSearchStrategy,
    {
      provide: SONG_SEARCH_STRATEGIES,
      inject: [LocalStrategy, SpinRhythmSearchStrategy],
      useFactory: (localStrategy: LocalStrategy) => {
        // Add back spinRhythmStrategy to this array to query the spinsha.re API directly.
        return [localStrategy];
      },
    },
    SongImporterManagerService,
    ModIoApiService,
  ],
  exports: [SongService],
})
export class SongStoreModule {}
