import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SongRequestsState } from './song-requests.reducer';

export const selectSongRequestsFeature =
  createFeatureSelector<SongRequestsState>('songRequests');

export const selectSongRequestQueue = createSelector(
  selectSongRequestsFeature,
  (state) => state.songRequestQueue
);

export const selectSongDownloadStates = createSelector(
  selectSongRequestsFeature,
  (state) => {
    console.log('selectSongDownloadStates', state);
    return state.songDownloadStates;
  }
);
