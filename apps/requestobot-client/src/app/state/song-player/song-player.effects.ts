import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SongPlayerActions } from './song-player.actions';
import { concatLatestFrom } from '@ngrx/operators';
import { selectChannel } from '../channel/channel.selectors';
import { exhaustMap } from 'rxjs';
import { QueuebotApiService } from '../../services/queuebot-api.service';
import { Injectable } from '@angular/core';

@Injectable()
export class SongPlayerEffects {
  play$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SongPlayerActions.play),
        concatLatestFrom((action) => this.store.select(selectChannel)),
        exhaustMap(async ([action, channel]) => {
          if (channel) {
            this.queuebotApi.playerPlay(channel.id, action.songId).subscribe();
          }
        })
      ),
    { dispatch: false }
  );
  pause$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SongPlayerActions.pause),
        concatLatestFrom((action) => this.store.select(selectChannel)),
        exhaustMap(async ([action, channel]) => {
          if (channel) {
            this.queuebotApi.playerPause(channel.id).subscribe();
          }
        })
      ),
    { dispatch: false }
  );
  stop$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SongPlayerActions.stop),
        concatLatestFrom((action) => this.store.select(selectChannel)),
        exhaustMap(async ([action, channel]) => {
          if (channel) {
            this.queuebotApi.playerStop(channel.id).subscribe();
          }
        })
      ),
    { dispatch: false }
  );
  constructor(
    private store: Store,
    private actions$: Actions,
    private queuebotApi: QueuebotApiService
  ) {}
}
