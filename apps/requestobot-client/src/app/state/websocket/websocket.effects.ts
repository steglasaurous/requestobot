import { WebsocketService } from '../../services/websocket.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { WebsocketActions } from './websocket.actions';
import { selectChannel } from '../channel/channel.selectors';
import { EMPTY, exhaustMap } from 'rxjs';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { SongRequestsActions } from '../song-requests/song-requests.actions';
import { SongRequestDto } from '@requestobot/util-dto';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class WebsocketEffects {
  enable$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(WebsocketActions.enable),
        concatLatestFrom(() => this.store.select(selectChannel)),
        exhaustMap(([action, channel]) => {
          if (!channel) {
            return EMPTY;
          }

          if (this.websocketService.isActive) {
            return EMPTY;
          }

          this.websocketService.connect({
            next: () => {
              this.store.dispatch(WebsocketActions.connected());
              this.websocketService.sendMessage({
                event: 'subscribe',
                data: {
                  chatServiceName: channel.chatServiceName,
                  channelName: channel.channelName,
                },
              });

              this.toastr.info('Websocket connected');
            },
            error: (err) => {
              console.log('Websocket connection error', err);
            },
            complete: () => {
              console.log('Websocket connection complete called');
            },
          });

          this.websocketService.messages$.subscribe(async (message) => {
            if (message.event == 'songRequestQueueChanged') {
              this.store.dispatch(
                SongRequestsActions.updateQueue({
                  songRequests: message.data as SongRequestDto[],
                })
              );
            }
          });

          this.websocketService.connectionStatus$.subscribe((status) => {
            if (!status.isConnected) {
              this.toastr.error('Websocket disconnected, retrying...');
              this.store.dispatch(
                WebsocketActions.connectionError({
                  message: status.errorMessage ?? '',
                })
              );
            }
          });

          return EMPTY;
        })
      ),
    { dispatch: false }
  );

  disable$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(WebsocketActions.disable),
        exhaustMap(() => {
          this.websocketService.close();
          return EMPTY;
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private websocketService: WebsocketService,
    private store: Store,
    private toastr: ToastrService
  ) {}
}
