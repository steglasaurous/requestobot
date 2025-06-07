import { Actions, createEffect, ofType } from '@ngrx/effects';
import { WebsocketActions } from './websocket.actions';
import { EMPTY, exhaustMap, of, Subscription } from 'rxjs';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import log from 'electron-log/renderer';
import { selectWebsocket } from './websocket.selectors';
import { WebsocketService } from '../services/websocket.service';

@Injectable()
export class WebsocketEffects {
  private subscriptions: Subscription[] = [];

  connect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WebsocketActions.connect),
      exhaustMap(() => {
        return of(WebsocketActions.enable());
      })
    )
  );

  enable$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(WebsocketActions.enable),
        concatLatestFrom(() => this.store.select(selectWebsocket)),
        exhaustMap(([action, state]) => {
          if (!state.channelName || !state.chatServiceName) {
            log.debug('Channel is not active, not enabling the websocket');
            return EMPTY;
          }

          if (this.websocketService.isActive) {
            log.debug('Websocket is already active');
            return EMPTY;
          }
          log.debug('Connecting to websocket');
          this.websocketService.connect(state.uri, {
            next: () => {
              log.debug('Websocket connected');
              this.store.dispatch(WebsocketActions.connected());
              this.websocketService.sendMessage({
                event: 'subscribe',
                data: {
                  chatServiceName: state.chatServiceName,
                  channelName: state.channelName,
                },
              });
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
              this.store.dispatch(
                WebsocketActions.websocketEvent({
                  event: message.event,
                  data: message.data,
                })
              );
            })
          );

          this.subscriptions.push(
            this.websocketService.connectionStatus$.subscribe((status) => {
              if (!status.isConnected) {
                log.warn('Websocket disconnected, retrying', {
                  message: status.errorMessage,
                });
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
    private store: Store
  ) {}
}
