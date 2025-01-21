import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { SongRequestsActions } from './song-requests.actions';
import { EMPTY, exhaustMap, of, switchMap } from 'rxjs';
import { QueuebotApiService } from '../../services/queuebot-api.service';
import { concatLatestFrom } from '@ngrx/operators';
import { selectChannel } from '../channel/channel.selectors';
import { WebsocketService } from '../../services/websocket.service';
import { SongRequestDto } from '@requestobot/util-dto';
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
      exhaustMap(([action, channel]) =>
        this.queuebotApiService.getSongRequestQueue(channel.id).pipe(
          switchMap((songRequests) => {
            return of(
              SongRequestsActions.updateQueue({ songRequests: songRequests })
            );
          })
        )
      )
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

  connectWebsocket$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SongRequestsActions.connectWebsocket),
        concatLatestFrom((action) => this.store.select(selectChannel)),
        exhaustMap(([action, channel]) => {
          this.websocketService.connect({
            next: () => {
              this.websocketService.sendMessage({
                event: 'subscribe',
                data: {
                  chatServiceName: channel.chatServiceName,
                  channelName: channel.channelName,
                },
              });
            },
            error: (err) => {
              console.log('Websocket connection error', err);
            },
            complete: () => {
              console.log('Websocket connection complete called');
            },
          });
          this.websocketService.messages$.subscribe(async (message) => {
            console.log(message);

            if (message.event == 'songRequestQueueChanged') {
              console.log('websocket', message.data);
              this.store.dispatch(
                SongRequestsActions.updateQueue({
                  songRequests: message.data as SongRequestDto[],
                })
              );
            }
          });

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
