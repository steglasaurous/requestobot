import { createFeatureSelector } from '@ngrx/store';
import { GameDto } from '@requestobot/util-dto';

export const selectGamesState = createFeatureSelector<GameDto[]>('games');
