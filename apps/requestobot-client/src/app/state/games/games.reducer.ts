import { GameDto } from '@requestobot/util-dto';
import { GamesActions } from './games.actions';
import { createReducer, on } from '@ngrx/store';

export const initialState: GameDto[] = [];

export const gamesReducer = createReducer(
  initialState,
  on(GamesActions.getGamesSuccess, (state, { games }) => {
    return games;
  })
);
