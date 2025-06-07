import { createFeatureSelector } from '@ngrx/store';
import { SongPlayerState } from './song-player.reducer';

export const selectSongPlayer =
  createFeatureSelector<SongPlayerState>('songPlayer');
