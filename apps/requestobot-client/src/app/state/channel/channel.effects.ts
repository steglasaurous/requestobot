import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { QueuebotApiService } from '../../services/queuebot-api.service';
import { ChannelActions } from './channel.actions';
import { delay, EMPTY, exhaustMap, map, of, switchMap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { selectChannel } from './channel.selectors';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import log from 'electron-log/renderer';

@Injectable()
export class ChannelEffects {
  loadChannel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChannelActions.loadChannel),
      exhaustMap(({ chatServiceName, channelName }) =>
        this.queuebotApiService.getChannel(chatServiceName, channelName).pipe(
          map((channelDto) => {
            log.debug('Channel loaded', { channelName: channelName });
            return ChannelActions.loadChannelSuccess({
              channel: channelDto,
            });
          }),
          catchError((err: HttpErrorResponse) => {
            return of(
              ChannelActions.loadChannelFail({
                chatServiceName: chatServiceName,
                channelName: channelName,
                error: err,
              })
            );
          })
        )
      )
    )
  );

  loadChannelFail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChannelActions.loadChannelFail),
      exhaustMap(({ channelName, chatServiceName, error }) => {
        if (error.status === 404) {
          log.debug('Load channel returned 404');
          this.router.navigate(['join']);
          return EMPTY;
        }
        log.warn('Load channel returned error, retrying', {
          message: error.message,
          status: error.status,
        });

        return of(
          ChannelActions.loadChannel({
            chatServiceName: chatServiceName,
            channelName: channelName,
          })
        ).pipe(delay(5000));
      })
    )
  );

  openQueue$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChannelActions.openQueue),
      concatLatestFrom((action) => this.store.select(selectChannel)),
      switchMap(([action, channelDto]) => {
        if (!channelDto) {
          return EMPTY;
        }
        return this.queuebotApiService.openQueue(channelDto.id).pipe(
          map(() => {
            return ChannelActions.openQueueSuccess();
          }),
          catchError((err: HttpErrorResponse) => {
            log.error('Open queue failed', {
              message: err.message,
              status: err.status,
            });

            this.toastr.error('Open queue failed');
            return of(
              ChannelActions.openQueueFail({
                error: err,
              })
            );
          })
        );
      })
    )
  );

  closeQueue$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChannelActions.closeQueue),
      concatLatestFrom((action) => this.store.select(selectChannel)),
      switchMap(([action, channelDto]) => {
        if (!channelDto) {
          return EMPTY;
        }
        return this.queuebotApiService.closeQueue(channelDto.id).pipe(
          map(() => {
            return ChannelActions.closeQueueSuccess();
          }),
          catchError((err: HttpErrorResponse) => {
            log.error('Close queue failed', {
              message: err.message,
              status: err.status,
            });
            this.toastr.error('Close queue failed');
            return of(
              ChannelActions.closeQueueFail({
                error: err,
              })
            );
          })
        );
      })
    )
  );

  setGame$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChannelActions.setGame),
      concatLatestFrom((action) => this.store.select(selectChannel)),
      switchMap(([action, channelDto]) => {
        if (!channelDto) {
          return EMPTY;
        }
        return this.queuebotApiService
          .setGame(channelDto.id, action.game.id)
          .pipe(
            map(() => {
              log.debug('Set game successfully', { gameId: action.game.id });

              return ChannelActions.setGameSuccess();
            }),
            catchError((err: HttpErrorResponse) => {
              log.error('Set game failed', {
                message: err.message,
                status: err.status,
              });
              this.toastr.error('Set game failed');
              return of(
                ChannelActions.setGameFail({
                  error: err,
                })
              );
            })
          );
      })
    )
  );

  setGameSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChannelActions.setGameSuccess),
      map(() => ChannelActions.clearQueue())
    )
  );

  clearQueue$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChannelActions.clearQueue),
      concatLatestFrom((action) => this.store.select(selectChannel)),
      switchMap(([action, channelDto]) => {
        if (!channelDto) {
          return EMPTY;
        }
        return this.queuebotApiService.clearQueue(channelDto.id).pipe(
          map(() => {
            log.debug('Cleared queue successfully');
            return ChannelActions.clearQueueSuccess();
          }),
          catchError((err: HttpErrorResponse) => {
            log.debug('Clear queue failed', {
              message: err.message,
              status: err.status,
            });
            this.toastr.error('Clear queue failed');

            return of(
              ChannelActions.clearQueueFail({
                error: err,
              })
            );
          })
        );
      })
    )
  );

  setSetting$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChannelActions.setSetting),
      concatLatestFrom((action) => this.store.select(selectChannel)),
      switchMap(([action, channelDto]) => {
        if (!channelDto) {
          return EMPTY;
        }
        return this.queuebotApiService
          .setSetting(channelDto.id, action.settingName, action.value)
          .pipe(
            map(() => {
              log.debug('Set setting succeeded', {
                settingName: action.settingName,
                value: action.value,
              });
              return ChannelActions.setSettingSuccess();
            }),
            catchError((err: HttpErrorResponse) => {
              log.debug('Set setting failed', {
                message: err.message,
                status: err.status,
              });
              this.toastr.error('Setting changed failed');
              return of(
                ChannelActions.setSettingFail({
                  error: err,
                })
              );
            })
          );
      })
    )
  );

  joinChannel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChannelActions.joinChannel),
      concatLatestFrom((action) => this.store.select(selectChannel)),
      switchMap(([action, channelDto]) => {
        if (!channelDto) {
          return EMPTY;
        }
        return this.queuebotApiService
          .joinChannel('twitch', channelDto.channelName)
          .pipe(
            map(() => {
              log.debug('Join channel succeeded', {
                channelName: channelDto.channelName,
              });
              return ChannelActions.joinChannelSuccess();
            }),
            catchError((err: HttpErrorResponse) => {
              log.warn('Join channel failed', {
                message: err.message,
                status: err.status,
              });
              this.toastr.error('Joining channel failed');
              return of(
                ChannelActions.joinChannelFail({
                  error: err,
                })
              );
            })
          );
      })
    )
  );

  joinChannelSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ChannelActions.joinChannelSuccess),
        exhaustMap(() => {
          this.router.navigate(['']);

          return EMPTY;
        })
      ),
    { dispatch: false }
  );

  createChannel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChannelActions.createChannel),
      exhaustMap(({ chatServiceName, channelName }) =>
        this.queuebotApiService
          .createChannel(chatServiceName, channelName)
          .pipe(
            map(() => ChannelActions.createChannelSuccess()),
            catchError((err: HttpErrorResponse) => {
              log.error('Create channel failed', {
                message: err.message,
                status: err.status,
              });

              this.toastr.error('Create channel failed');
              return of(
                ChannelActions.createChannelFail({
                  chatServiceName: chatServiceName,
                  channelName: channelName,
                  error: err,
                })
              );
            })
          )
      )
    )
  );

  createChannelSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ChannelActions.createChannelSuccess),
        exhaustMap(() => {
          this.router.navigate(['']);

          return EMPTY;
        })
      ),
    { dispatch: false }
  );

  enableBot$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChannelActions.enableBot),
      concatLatestFrom((action) => this.store.select(selectChannel)),
      exhaustMap(([action, channelDto]) => {
        if (!channelDto) {
          return EMPTY;
        }
        return this.queuebotApiService.enableBot(channelDto.id).pipe(
          map(() => {
            log.debug('Enable bot succeeded');
            return ChannelActions.enableBotSuccess();
          }),
          catchError((err: HttpErrorResponse) => {
            log.debug('Enable bot failed', {
              message: err.message,
              status: err.status,
            });
            this.toastr.error('Enable bot failed');
            return of(
              ChannelActions.enableBotFail({
                error: err,
              })
            );
          })
        );
      })
    )
  );

  disableBot$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChannelActions.disableBot),
      concatLatestFrom((action) => this.store.select(selectChannel)),
      exhaustMap(([action, channelDto]) => {
        if (!channelDto) {
          return EMPTY;
        }
        return this.queuebotApiService.disableBot(channelDto.id).pipe(
          map(() => {
            log.debug('Disable bot succeeded');
            return ChannelActions.disableBotSuccess();
          }),
          catchError((err: HttpErrorResponse) => {
            log.debug('Disable bot failed', {
              message: err.message,
              status: err.status,
            });
            this.toastr.error('Disable bot failed');
            return of(
              ChannelActions.disableBotFail({
                error: err,
              })
            );
          })
        );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private queuebotApiService: QueuebotApiService,
    private router: Router,
    private store: Store,
    private toastr: ToastrService
  ) {}
}
