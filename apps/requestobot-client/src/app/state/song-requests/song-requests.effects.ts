import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { SongRequestsActions } from './song-requests.actions';
import { EMPTY, exhaustMap, of, switchMap } from 'rxjs';
import { QueuebotApiService } from '../../services/queuebot-api.service';
import { concatLatestFrom } from '@ngrx/operators';
import { selectChannel } from '../channel/channel.selectors';
import { WebsocketService } from '../../services/websocket.service';
import {
  selectSongDownloadStates,
  selectSongRequestQueue,
} from './song-requests.selectors';
import { WindowWithElectron } from '../../models/window.global';
import { LocalSongState } from '@requestobot/util-client-common';

declare let window: WindowWithElectron;

@Injectable()
export class SongRequestsEffects {
  getQueue$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SongRequestsActions.getQueue),
      concatLatestFrom((action) => this.store.select(selectChannel)),
      exhaustMap(([action, channel]) => {
        if (!channel) {
          return EMPTY;
        }
        return this.queuebotApiService.getSongRequestQueue(channel.id).pipe(
          switchMap((songRequests) => {
            return of(
              SongRequestsActions.updateQueue({ songRequests: songRequests })
            );
          })
        );
      })
    )
  );

  updateQueue$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SongRequestsActions.updateQueue),
        concatLatestFrom(() => this.store.select(selectSongDownloadStates)),
        exhaustMap(([{ songRequests }, songDownloadStates]) => {
          // Go through all the songs in the queue, compare with their local song status.
          for (const songRequest of songRequests) {
            let processSong = true;
            if (songDownloadStates[songRequest.song.id]) {
              console.log(
                'Song is already been processed',
                songRequest.song.id
              );
              processSong = false;
            }

            if (processSong && window.songs) {
              console.log('dispatching processSong');
              this.store.dispatch(
                SongRequestsActions.processSong({ song: songRequest.song })
              );
            }
          }

          return EMPTY;
        })
      ),
    { dispatch: false }
  );

  processSong$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SongRequestsActions.processSong),
        exhaustMap(({ song }) => {
          if (window.songs) {
            window.songs.processSong(song);
          }

          return EMPTY;
        })
      ),
    { dispatch: false }
  );

  swapRequestOrder$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SongRequestsActions.swapRequestOrder),
        concatLatestFrom(() => [
          this.store.select(selectChannel),
          this.store.select(selectSongRequestQueue),
        ]),
        exhaustMap(
          ([
            { songRequestPreviousIndex, songRequestCurrentIndex },
            channel,
            songRequestQueue,
          ]) => {
            if (!channel) {
              return EMPTY;
            }
            this.queuebotApiService
              .swapOrder(
                channel.id,
                songRequestQueue[songRequestPreviousIndex].id,
                songRequestQueue[songRequestCurrentIndex].id
              )
              .subscribe(() => {
                console.log('swapped');
              });

            return EMPTY;
          }
        )
      ),
    { dispatch: false }
  );

  deleteSongRequest$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SongRequestsActions.deleteRequest),
        concatLatestFrom(() => [this.store.select(selectChannel)]),
        exhaustMap(([{ songRequestId }, channel]) => {
          if (!channel) {
            return EMPTY;
          }
          this.queuebotApiService
            .deleteSongRequest(channel.id, songRequestId)
            .subscribe({
              next: (result) => {
                console.log('Deleted song request', { result: result });
              },
              error: (err) => {
                console.log('deleteSongRequest error', { err: err });
              },
            });

          return EMPTY;
        })
      ),
    { dispatch: false }
  );

  setRequestActive$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SongRequestsActions.setRequestActive),
        concatLatestFrom(() => [this.store.select(selectChannel)]),
        exhaustMap(([{ songRequestId }, channel]) => {
          if (!channel) {
            return EMPTY;
          }
          this.queuebotApiService
            .setSongRequestActive(channel.id, songRequestId)
            .subscribe({
              next: (result) => {
                console.log('setRequestActive done');
              },
              error: (err) => {
                console.log('setRequestActive failed', err);
              },
              complete: () => {
                console.log('setRequestActive complete');
              },
            });

          return EMPTY;
        })
      ),
    { dispatch: false }
  );

  nextSong$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SongRequestsActions.nextSong),
        concatLatestFrom(() => [this.store.select(selectChannel)]),
        exhaustMap(([action, channel]) => {
          if (!channel) {
            return EMPTY;
          }
          this.queuebotApiService.nextSong(channel.id).subscribe({
            next: () => {
              // Dispatch a next song complete
              this.store.dispatch(SongRequestsActions.nextSongComplete());
            },
            error: (err) => {
              console.log('nextSong failed', err);
            },
          });

          return EMPTY;
        })
      ),
    { dispatch: false }
  );

  reprocessSongs$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SongRequestsActions.reprocessSongs),
        concatLatestFrom((action) => this.store.select(selectSongRequestQueue)),
        exhaustMap(([action, songRequestQueue]) => {
          for (const songRequest of songRequestQueue) {
            this.store.dispatch(
              SongRequestsActions.processSong({ song: songRequest.song })
            );
          }

          return EMPTY;
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private queuebotApiService: QueuebotApiService,
    private store: Store,
    @Inject('WebsocketService') private websocketService: WebsocketService
  ) {
    if (window.songs) {
      window.songs.onProcessSongProgress((songState: LocalSongState) => {
        console.log('Got progress update', songState);
        this.store.dispatch(
          SongRequestsActions.updateSongDownloadProgress({ songState })
        );
      });
    }
  }
}
