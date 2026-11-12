import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Song } from '../../data-store/entities/song.entity';
import { Game } from '../../data-store/entities/game.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'node:crypto';

@Injectable()
export class SongService {
  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>
  ) {}

  createSongEntity(
    game: Game,
    title: string,
    artist: string,
    mapper: string,
    hash?: string,
    downloadUrl?: string,
    bpm?: number,
    duration?: number,
    fileReference?: string,
    coverArtUrl?: string
  ): Song {
    if (!hash) {
      hash = crypto
        .createHash('sha256')
        .update(JSON.stringify(game.name + title + artist + mapper))
        .digest('hex');
    }

    const song = new Song();
    song.game = game;
    song.songHash = hash;
    song.artist = artist ?? null;
    song.title = title;
    song.mapper = mapper;
    song.downloadUrl = downloadUrl ?? null;
    song.bpm = bpm ?? null;
    song.duration = duration ?? null;
    song.fileReference = fileReference ?? null;
    song.coverArtUrl = coverArtUrl ?? null;
    song.dataSignature = this.generateSongDataSignature(song);

    if (isNaN(song.bpm)) {
      song.bpm = null;
    }

    if (isNaN(song.duration)) {
      song.duration = null;
    }

    return song;
  }

  generateSongDataSignature(song: Song) {
    return crypto
      .createHash('sha256')
      .update(
        song.title +
          song.artist +
          song.mapper +
          song.downloadUrl +
          song.bpm +
          song.duration +
          song.fileReference +
          song.coverArtUrl
      )
      .digest('hex');
  }

  async saveSong(song: Song, updateExisting = true): Promise<Song> {
    const existingSong = await this.songRepository.findOneBy({
      game: song.game,
      songHash: song.songHash,
    });

    if (existingSong && updateExisting) {
      // Do an update on this.
      existingSong.title = song.title;
      existingSong.artist = song.artist;
      existingSong.mapper = song.mapper;
      existingSong.downloadUrl = song.downloadUrl;
      existingSong.bpm = song.bpm;
      existingSong.duration = song.duration;
      existingSong.coverArtUrl = song.coverArtUrl;
      existingSong.fileReference = song.fileReference;
      existingSong.dataSignature = song.dataSignature;

      return await this.songRepository.save(existingSong);
    }

    return await this.songRepository.save(song);
  }

  async getSongBySongHash(
    game: Game,
    songHash: string
  ): Promise<Song | undefined> {
    return await this.songRepository.findOneBy({
      game: game,
      songHash: songHash,
    });
  }

  async getSongHashesAndDataSignatures(
    game: Game
  ): Promise<Map<string, string>> {
    const outputMap = new Map<string, string>();

    const result = await this.songRepository.query(
      `SELECT "songHash", "dataSignature" from "song" where "gameId" = ${game.id}`
    );

    for (const keyPair of result) {
      outputMap.set(keyPair['songHash'], keyPair['dataSignature']);
    }

    return outputMap;
  }
}
