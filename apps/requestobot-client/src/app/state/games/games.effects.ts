import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { GamesActions } from './games.actions';
import { QueuebotApiService } from '../../services/queuebot-api.service';
import { exhaustMap, map } from 'rxjs';

@Injectable()
export class GamesEffects {
  getGames$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GamesActions.getGames),
      exhaustMap(() =>
        this.queuebotApiService
          .getGames()
          .pipe(
            map((gameDtos) => GamesActions.getGamesSuccess({ games: gameDtos }))
          )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private queuebotApiService: QueuebotApiService
  ) {}
}
