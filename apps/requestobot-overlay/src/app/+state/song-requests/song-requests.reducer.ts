import { SongRequestDto } from '@requestobot/util-dto';
import { createReducer, on } from '@ngrx/store';
import { SongRequestsActions } from './song-requests.actions';

export interface SongRequestsState {
  songRequestQueue: SongRequestDto[];
}

export const initialState: SongRequestsState = {
  songRequestQueue: [],
};

export const songRequestsReducer = createReducer(
  initialState,
  on(SongRequestsActions.updateQueue, (state, { songRequests }) => {
    return { ...state, songRequestQueue: songRequests };
  })
);
