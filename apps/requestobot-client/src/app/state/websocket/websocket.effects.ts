import { WebsocketService } from '../../services/websocket.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { WebsocketActions } from './websocket.actions';
import { selectChannel } from '../channel/channel.selectors';
import { EMPTY, exhaustMap, Subscription } from 'rxjs';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { SongRequestsActions } from '../song-requests/song-requests.actions';
import { SongRequestDto } from '@requestobot/util-dto';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import log from 'electron-log/renderer';

@Injectable()
export class WebsocketEffects {
  private subscriptions: Subscription[] = [];

  enable$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(WebsocketActions.enable),
        concatLatestFrom(() => this.store.select(selectChannel)),
        exhaustMap(([action, channel]) => {
          if (!channel) {
            log.debug('Channel is not active, not enabling the websocket');
            return EMPTY;
          }

          if (this.websocketService.isActive) {
            log.debug('Websocket is already active');
            return EMPTY;
          }

          this.websocketService.connect({
            next: () => {
              log.debug('Websocket connected');
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
              log.warn('Websocket connection error', err);
            },
            complete: () => {
              log.debug('Websocket connection complete called');
            },
          });

          this.subscriptions.push(
            this.websocketService.messages$.subscribe(async (message) => {
              log.debug('Websocket Message', { event: message.event });
              if (message.event == 'songRequestQueueChanged') {
                this.store.dispatch(
                  SongRequestsActions.updateQueue({
                    songRequests: message.data as SongRequestDto[],
                  })
                );
              }
            })
          );

          this.subscriptions.push(
            this.websocketService.connectionStatus$.subscribe((status) => {
              if (!status.isConnected) {
                log.warn('Websocket disconnected, retrying', {
                  message: status.errorMessage,
                });
                this.toastr.error('Websocket disconnected, retrying...');
                this.store.dispatch(
                  WebsocketActions.connectionError({
                    message: status.errorMessage ?? '',
                  })
                );
              }
            })
          );

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
          log.debug('Closing and disabling the websocket');
          for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
          }
          this.subscriptions = [];

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
