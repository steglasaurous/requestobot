import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { WebsocketActions } from '@requestobot/util-requestobot-websocket';
import { EMPTY, exhaustMap, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { SongPlayerActions } from './song-player.actions';
import { log } from 'electron-log';
import { concatLatestFrom } from '@ngrx/operators';
import { selectSongPlayer } from './song-player.selector';

@Injectable()
export class SongPlayerEffects {
  playNewSong$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(WebsocketActions.websocketEvent),
        concatLatestFrom((action) => this.store.select(selectSongPlayer)),
        switchMap(([{ event, data }, state]) => {
          if (event == 'playerStateChangeEvent') {
            log('Got a playerStateChangeEvent');
            log(data);
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

            if (state.volume !== data.volume) {
              this.store.dispatch(SongPlayerActions.changeVolume({ volume: data.volume }));
            }
          }

          return EMPTY;
        })
      ),
    { dispatch: false }
  );
  constructor(private actions$: Actions, private store: Store) {}
}
