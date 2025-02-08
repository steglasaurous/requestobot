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
import { SettingsService } from '../../services/settings.service';

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

  loadChannelFail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChannelActions.loadChannelFail),
      exhaustMap(({ channelName, chatServiceName, error }) => {
        if (error.status === 404) {
          this.router.navigate(['join']);
          return EMPTY;
        }

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
              return ChannelActions.setGameSuccess();
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
            return ChannelActions.clearQueueSuccess();
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
              return ChannelActions.setSettingSuccess();
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
              return ChannelActions.joinChannelSuccess();
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

  enableBot$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChannelActions.enableBot),
      concatLatestFrom((action) => this.store.select(selectChannel)),
      exhaustMap(([action, channelDto]) => {
        if (!channelDto) {
          return EMPTY;
        }
        return this.queuebotApiService
          .enableBot(channelDto.id)
          .pipe(map(() => ChannelActions.enableBotSuccess()));
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
        return this.queuebotApiService
          .disableBot(channelDto.id)
          .pipe(map(() => ChannelActions.disableBotSuccess()));
      })
    )
  );

  constructor(
    private actions$: Actions,
    private queuebotApiService: QueuebotApiService,
    private router: Router,
    private settingsService: SettingsService,
    private store: Store
  ) {}
}
