import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { WebsocketActions } from '@requestobot/util-requestobot-websocket';
import { EMPTY, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { SongRequestsActions } from './song-requests.actions';

@Injectable()
export class SongRequestsEffects {
  updateQueue$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(WebsocketActions.websocketEvent),
        switchMap(({ event, data }) => {
          if (event == 'songRequestQueueChanged') {
            this.store.dispatch(
              SongRequestsActions.updateQueue({ songRequests: data })
            );
          }
          if (event == 'queue') {
            this.store.dispatch(
              SongRequestsActions.updateQueue({
                songRequests: data.songRequests,
              })
            );
          }

          return EMPTY;
        })
      ),
    { dispatch: false }
  );
  constructor(private actions$: Actions, private store: Store) {}
}
