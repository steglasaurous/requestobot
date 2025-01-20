import { SongRequestDto } from '@requestobot/util-dto';
import { createReducer, on } from '@ngrx/store';
import { LocalSongState } from '@requestobot/util-client-common';
import { SongRequestsActions } from './song-requests.actions';
import { moveItemInArray } from '@angular/cdk/drag-drop';

export interface SongRequestsState {
  songRequestQueue: SongRequestDto[];
  songDownloadStates: Map<number, LocalSongState>;
}

export const initialState: SongRequestsState = {
  songRequestQueue: [],
  songDownloadStates: new Map<number, LocalSongState>(),
};

export const songRequestsReducer = createReducer(
  initialState,

  on(SongRequestsActions.updateQueue, (state, { songRequests }) => {
    return { ...state, songRequestQueue: songRequests };
  }),

  on(SongRequestsActions.updateSongDownloadProgress, (state, { songState }) => {
    const newState = state;

    newState.songDownloadStates.set(songState.songId, songState);
    console.log(newState.songDownloadStates);

    return newState;
  }),
  on(
    SongRequestsActions.swapRequestOrder,
    (state, { songRequestPreviousIndex, songRequestCurrentIndex }) => {
      console.log('swap', songRequestPreviousIndex, songRequestCurrentIndex);
      const songRequestQueue = { ...state.songRequestQueue };
      console.log('before', songRequestQueue);

      const previousSongRequest = songRequestQueue[songRequestPreviousIndex];
      console.log(
        'previous song is',
        songRequestQueue[songRequestPreviousIndex].song.title
      );
      console.log(
        'current song is',
        songRequestQueue[songRequestCurrentIndex].song.title
      );
      songRequestQueue[songRequestPreviousIndex] =
        songRequestQueue[songRequestCurrentIndex];
      songRequestQueue[songRequestCurrentIndex] = previousSongRequest;

      console.log('after', songRequestQueue);

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
