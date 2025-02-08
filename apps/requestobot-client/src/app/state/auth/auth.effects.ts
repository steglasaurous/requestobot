import { Injectable, NgZone } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { QueuebotApiService } from '../../services/queuebot-api.service';
import { Router } from '@angular/router';
import { SettingsService } from '../../services/settings.service';
import { delay, EMPTY, exhaustMap, from, map, of, switchMap } from 'rxjs';
import { SettingName } from '@requestobot/util-client-common';
import { AuthActions } from './auth.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthEffects {
  // Note this doesn't accommodate for error states.  Need to figure out how exactly to do
  // that with effects/observables..

  submitAuthCode$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.submitAuthCode),
      exhaustMap(({ authCode }) =>
        this.queuebotApiService.getAuthCodeResult(authCode).pipe(
          switchMap((result) => {
            if (result.status === 'OK') {
              return from(
                this.settingsService.setValue('username', result.username)
              ).pipe(
                map(() =>
                  AuthActions.loginSuccess({ username: result.username })
                )
              );
            }

            return of(AuthActions.loginFail());
          }),
          catchError((err: HttpErrorResponse) => {
            console.log(
              'API Error while logging in via auth code:',
              err.message
            );
            return of(AuthActions.loginFail());
          })
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        map(async ({ username }) => {
          this.zone.run(() => {
            this.router.navigate(['']);
          });
        })
      ),
    { dispatch: false }
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        exhaustMap(async () => {
          await this.settingsService.deleteValue(SettingName.username);

          // NOTE: JWT and JWTRefresh won't delete the cookies if using the web client outside of electron.
          await this.settingsService.deleteValue(SettingName.JWT);
          await this.settingsService.deleteValue(SettingName.JWTRefresh);
          this.queuebotApiService.logout().subscribe(async () => {
            console.log('API logged out');
            this.store.dispatch(AuthActions.notAuthenticated());
            await this.router.navigate(['login']);
          });

          return EMPTY;
        })
      ),
    { dispatch: false }
  );

  // FIXME: There's a case in a regular browser where logout does NOT destroy cookies,
  //   so this check can erroniously indicate the user is authenticated when they're not.
  //   Should add a server call to logout the user and clear cookies it set.
  checkAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.checkAuth),
      exhaustMap(() =>
        this.queuebotApiService.checkAuth().pipe(
          map((status) => {
            if (status.status == 'OK') {
              return AuthActions.authenticated();
            }

            return AuthActions.refreshAuth();
          }),
          catchError((err: HttpErrorResponse) => {
            if (err.status === 401 || err.status === 403) {
              console.log('got a 401/403');
              // Attempt a refresh.  If that fails, then we're 100% not authenticated.
              return of(AuthActions.refreshAuth());
            }

            console.log('got a generic error');

            // Any other error is either a server-side problem or connection issue.
            return of(AuthActions.connectionFailure());
          })
        )
      )
    )
  );

  retryAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.connectionFailure),
      delay(5000),
      exhaustMap(() => of(AuthActions.checkAuth()))
    )
  );

  refreshAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshAuth),
      exhaustMap(() =>
        this.queuebotApiService.refreshJwt().pipe(
          map((status) => {
            console.log('refresh ok');
            if (status.status == 'OK') {
              return AuthActions.authenticated();
            }
            return AuthActions.notAuthenticated();
          }),
          catchError((err: HttpErrorResponse) => {
            console.log(`refresh error: ${err.message}`);
            return of(AuthActions.logout());
          })
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private queuebotApiService: QueuebotApiService,
    private router: Router,
    private settingsService: SettingsService,
    private zone: NgZone
  ) {}
}
