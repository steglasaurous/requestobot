import { SongDto } from '@requestobot/util-dto';
import { createReducer, on } from '@ngrx/store';
import { SongPlayerActions } from './song-player.actions';

export interface SongPlayerState {
  song: SongDto | null;
  // FIXME: I'd prefer to use the PlayerState defined in the backend, but typeorm gets funny about dependencies outside of
  //   the server app.  (can't resolve library references I think).  If I figure that out some time, replace this.
  playerState: string;
  volume: number;
}

export const initialState: SongPlayerState = {
  song: null,
  playerState: 'stopped',
  volume: 100,
};

export const songPlayerReducer = createReducer(
  initialState,
  on(SongPlayerActions.setSongAndPlay, (state, { song }) => {
    return { ...state, song: song, playerState: 'playing' };
  }),
  on(SongPlayerActions.pause, (state) => {
    return { ...state, playerState: 'paused' };
  }),
  on(SongPlayerActions.stop, (state) => {
    return { ...state, playerState: 'stopped' };
  }),
  on(SongPlayerActions.changeVolume, (state, { volume }) => {
    return { ...state, volume: volume };
  })
);
