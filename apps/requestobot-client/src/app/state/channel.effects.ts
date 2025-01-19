import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { QueuebotApiService } from '../services/queuebot-api.service';
import { ChannelActions } from './channel.actions';
import { EMPTY, exhaustMap, map, of, switchMap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { selectChannel } from './channel.selectors';
import { Store } from '@ngrx/store';
import { SettingsService } from '../services/settings.service';
import { SettingName } from '@requestobot/util-client-common';

@Injectable()
export class ChannelEffects {
  loadChannel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChannelActions.loadChannel),
      exhaustMap(({ chatServiceName, channelName }) =>
        this.queuebotApiService.getChannel(chatServiceName, channelName).pipe(
          map((channelDto) =>
            ChannelActions.loadChannelSuccess({
              channel: channelDto,
            })
          ),
          catchError((err: HttpErrorResponse) =>
            of(
              ChannelActions.loadChannelFail({
                chatServiceName: chatServiceName,
                channelName: channelName,
                error: err,
              })
            )
          )
        )
      )
    )
  );

  loadChannelFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ChannelActions.loadChannelFail),
        exhaustMap(({ channelName, chatServiceName, error }) => {
          console.log('loadChannelFail$');
          // FIXME: Dispatch action to update status of connection.

          if (error.status === 404) {
            this.router.navigate(['join']);
          }

          return EMPTY;
        })
      ),
    { dispatch: false }
  );

  openQueue$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChannelActions.openQueue),
      concatLatestFrom((action) => this.store.select(selectChannel)),
      switchMap(([action, channelDto]) =>
        this.queuebotApiService.openQueue(channelDto.id).pipe(
          map(() => {
            return ChannelActions.openQueueSuccess();
          })
        )
      )
    )
  );

  closeQueue$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChannelActions.closeQueue),
      concatLatestFrom((action) => this.store.select(selectChannel)),
      switchMap(([action, channelDto]) =>
        this.queuebotApiService.closeQueue(channelDto.id).pipe(
          map(() => {
            return ChannelActions.closeQueueSuccess();
          })
        )
      )
    )
  );

  setGame$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChannelActions.setGame),
      concatLatestFrom((action) => this.store.select(selectChannel)),
      switchMap(([action, channelDto]) =>
        this.queuebotApiService.setGame(channelDto.id, action.game.id).pipe(
          map(() => {
            return ChannelActions.setGameSuccess();
          })
        )
      )
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
      switchMap(([action, channelDto]) =>
        this.queuebotApiService.clearQueue(channelDto.id).pipe(
          map(() => {
            return ChannelActions.clearQueueSuccess();
          })
        )
      )
    )
  );

  setSetting$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChannelActions.setSetting),
      concatLatestFrom((action) => this.store.select(selectChannel)),
      switchMap(([action, channelDto]) =>
        this.queuebotApiService
          .setSetting(channelDto.id, action.settingName, action.value)
          .pipe(
            map(() => {
              return ChannelActions.setSettingSuccess();
            })
          )
      )
    )
  );

  joinChannel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChannelActions.joinChannel),
      concatLatestFrom((action) => this.store.select(selectChannel)),
      switchMap(([action, channelDto]) =>
        this.queuebotApiService
          .joinChannel('twitch', channelDto.channelName)
          .pipe(
            map(() => {
              return ChannelActions.joinChannelSuccess();
            })
          )
      )
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
          .pipe(map(() => ChannelActions.createChannelSuccess()))
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

  constructor(
    private actions$: Actions,
    private queuebotApiService: QueuebotApiService,
    private router: Router,
    private settingsService: SettingsService,
    private store: Store
  ) {}
}
