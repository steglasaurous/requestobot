import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { selectChannel } from '../channel/channel.selectors';
import { EMPTY, exhaustMap, switchMap } from 'rxjs';
import { QueuebotApiService } from '../../services/queuebot-api.service';
import { Injectable } from '@angular/core';
import { SongRequestsActions } from '../song-requests/song-requests.actions';
import { selectSongPlayer, SongPlayerActions } from '@requestobot/util-song-player';
import { WebsocketActions } from '@requestobot/util-requestobot-websocket';

@Injectable()
export class SongPlayerEffects {
  play$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SongPlayerActions.play),
        concatLatestFrom((action) => this.store.select(selectChannel)),
        exhaustMap(async ([action, channel]) => {
          if (channel) {
            if (action.song) {
              this.queuebotApi.playerPlay(channel.id, action.song.id).subscribe();
            } else {
              this.queuebotApi.playerPlay(channel.id).subscribe();
            }

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
  volumeChange$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SongPlayerActions.changeVolume),
        concatLatestFrom((action) => this.store.select(selectChannel)),
        exhaustMap(async ([action, channel]) => {
          if (channel) {
            this.queuebotApi
              .playerVolumeChange(channel.id, action.volume)
              .subscribe();
          }
        })
      ),
    { dispatch: false }
  );

  nextTrack$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SongPlayerActions.nextTrack),
        exhaustMap(() => {
          this.store.dispatch(SongRequestsActions.nextSong())
          return EMPTY;
        })
      ), { dispatch: false }
  );

  playNextTrack$ = createEffect(
    () => this.actions$.pipe(
      ofType(SongRequestsActions.nextSongSuccess),
      exhaustMap(({ songRequest }) => {
        if (songRequest) {
          this.store.dispatch(SongPlayerActions.play({ song: songRequest.song }))
        }
        return EMPTY;
      })
    ), { dispatch: false }
  );

  // nextTrack
  // If enabled to advance the queue when going to next track, call nextSong first.
  // If not, just find the next item in the queue in relation to the current one.
  // If there's no song selected, just start the fist one in the list.

  // nextTrack -> nextSong -> nextSongSuccess -> play

  // previousTrack
  // Implement in next round.

  updatePlayerState$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(WebsocketActions.websocketEvent),
        concatLatestFrom((action) => this.store.select(selectSongPlayer)),
        switchMap(([{ event, data }, state]) => {
          if (event == 'playerStateChangeEvent') {
            console.log(data);
            // Just update state, don't do API stuff.
            this.store.dispatch(
              SongPlayerActions.update({ song: data.song, playerState: data.state, volume: data.volume })
            );
          }

          return EMPTY;
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
