import { SongRequestDto } from '@requestobot/util-dto';
import { createReducer, on } from '@ngrx/store';
import { LocalSongState } from '@requestobot/util-client-common';
import { SongRequestsActions } from './song-requests.actions';
import log from 'electron-log/renderer';

export interface SongDownloadStates {
  [key: number]: LocalSongState;
}

export interface SongRequestsState {
  songRequestQueue: SongRequestDto[];
  songDownloadStates: SongDownloadStates;
  deletedSongRequest?: SongRequestDto;
  deletedSongRequestIndex?: string;
}

export const initialState: SongRequestsState = {
  songRequestQueue: [],
  songDownloadStates: {},
  deletedSongRequest: undefined,
  deletedSongRequestIndex: undefined,
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
  on(
    SongRequestsActions.swapRequestOrderFail,
    (state, { songRequestPreviousIndex, songRequestCurrentIndex, error }) => {
      const songRequestQueue = { ...state.songRequestQueue };

      // We're swapping songs back since it failed.
      const currentSongRequest = songRequestQueue[songRequestCurrentIndex];
      songRequestQueue[songRequestCurrentIndex] =
        songRequestQueue[songRequestPreviousIndex];
      songRequestQueue[songRequestPreviousIndex] = currentSongRequest;

      return { ...state, songRequestQueue: songRequestQueue };
    }
  ),
  on(SongRequestsActions.deleteRequest, (state, { songRequestId }) => {
    let deletedSongRequest;
    let deletedSongRequestIndex;

    for (const index in state.songRequestQueue) {
      if (state.songRequestQueue[index].id === songRequestId) {
        deletedSongRequest = state.songRequestQueue[index];
        deletedSongRequestIndex = index;
      }
    }

    if (!deletedSongRequest && !deletedSongRequestIndex) {
      return state;
    }

    const songRequests = state.songRequestQueue.filter(
      (songRequest) => songRequest.id !== songRequestId
    );
    log.debug('Removed song request', songRequests);
    return {
      ...state,
      songRequestQueue: songRequests,
      deletedSongRequest: deletedSongRequest,
      deletedSongRequestIndex: deletedSongRequestIndex,
    };
  }),
  on(SongRequestsActions.deleteRequestSuccess, (state) => {
    return {
      ...state,
      deletedSongRequest: undefined,
      deletedSongRequestIndex: undefined,
    };
  }),
  on(SongRequestsActions.deleteRequestFail, (state) => {
    // Put the song back into its original position.
    const songRequests = [...state.songRequestQueue];
    if (state.deletedSongRequestIndex && state.deletedSongRequest) {
      songRequests.splice(
        parseInt(state.deletedSongRequestIndex),
        0,
        state.deletedSongRequest
      );
      return {
        ...state,
        songRequestQueue: songRequests,
        deletedSongRequest: undefined,
        deletedSongRequestIndex: undefined,
      };
    }
    return state;
  }),
  on(SongRequestsActions.reprocessSongs, (state) => {
    return { ...state, songDownloadStates: {} };
  })
);
