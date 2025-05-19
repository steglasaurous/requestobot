import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { WebsocketActions } from '@requestobot/util-requestobot-websocket';
import { EMPTY, exhaustMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { SongPlayerActions } from './song-player.actions';
import { log } from 'electron-log';

@Injectable()
export class SongPlayerEffects {
  playNewSong$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(WebsocketActions.websocketEvent),
        exhaustMap(({ event, data }) => {
          if (event == 'playerStateChangeEvent') {
            log('Got a playerStateChangeEvent');
            switch (data.state) {
              case 'playing':
                this.store.dispatch(
                  SongPlayerActions.setSongAndPlay({ song: data.song })
                );
                break;
              case 'paused':
                this.store.dispatch(SongPlayerActions.pause());
                break;
              case 'stopped':
                this.store.dispatch(SongPlayerActions.stop());
                break;
            }
          }

          return EMPTY;
        })
      ),
    { dispatch: false }
  );
  constructor(private actions$: Actions, private store: Store) {}
}
