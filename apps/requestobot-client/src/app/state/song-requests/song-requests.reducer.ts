import { SongRequestDto } from '@requestobot/util-dto';
import { createReducer, on } from '@ngrx/store';
import { LocalSongState } from '@requestobot/util-client-common';
import { SongRequestsActions } from './song-requests.actions';

export interface SongDownloadStates {
  [key: number]: LocalSongState;
}

export interface SongRequestsState {
  songRequestQueue: SongRequestDto[];
  songDownloadStates: SongDownloadStates;
}

export const initialState: SongRequestsState = {
  songRequestQueue: [],
  songDownloadStates: {},
};

export const songRequestsReducer = createReducer(
  initialState,

  on(SongRequestsActions.updateQueue, (state, { songRequests }) => {
    return { ...state, songRequestQueue: songRequests };
  }),

  on(SongRequestsActions.updateSongDownloadProgress, (state, { songState }) => {
    const songDownloadStates = { ...state.songDownloadStates };
    songDownloadStates[songState.songId] = songState;
    return { ...state, songDownloadStates: songDownloadStates };
  }),
  on(
    SongRequestsActions.swapRequestOrder,
    (state, { songRequestPreviousIndex, songRequestCurrentIndex }) => {
      const songRequestQueue = { ...state.songRequestQueue };

      const previousSongRequest = songRequestQueue[songRequestPreviousIndex];
      songRequestQueue[songRequestPreviousIndex] =
        songRequestQueue[songRequestCurrentIndex];
      songRequestQueue[songRequestCurrentIndex] = previousSongRequest;

      return { ...state, songRequestQueue: songRequestQueue };
    }
  ),
  on(SongRequestsActions.deleteRequest, (state, { songRequestId }) => {
    const songRequests = state.songRequestQueue.filter(
      (songRequest) => songRequest.id !== songRequestId
    );

    return { ...state, songRequestQueue: songRequests };
  })
);
