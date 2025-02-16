import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { GamesActions } from './games.actions';
import { QueuebotApiService } from '../../services/queuebot-api.service';
import { delay, exhaustMap, map, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import log from 'electron-log/renderer';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class GamesEffects {
  getGames$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GamesActions.getGames),
      exhaustMap(() =>
        this.queuebotApiService.getGames().pipe(
          map((gameDtos) => GamesActions.getGamesSuccess({ games: gameDtos })),
          catchError((err) => of(GamesActions.getGamesFail(err)))
        )
      )
    )
  );

  getGamesFail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GamesActions.getGamesFail),
      exhaustMap(({ error }) => {
        log.error('Failed to get list of games from API, retrying', {
          message: error.message,
          status: error.status,
        });
        this.toastr.error('Failed to get list of games from API, retrying...');
        return of(GamesActions.getGames()).pipe(delay(5000));
      })
    )
  );

  constructor(
    private actions$: Actions,
    private queuebotApiService: QueuebotApiService,
    private toastr: ToastrService
  ) {}
}
