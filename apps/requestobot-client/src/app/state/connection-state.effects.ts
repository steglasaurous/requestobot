import { Injectable } from '@angular/core';
import { QueuebotApiService } from '../services/queuebot-api.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ConnectionStateActions } from './connection-state.actions';
import { EMPTY, exhaustMap, map, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthActions } from './auth.actions';

@Injectable()
export class ConnectionStateEffects {
  // FIXME: There's a case in a regular browser where logout does NOT destroy cookies,
  //   so this check can erroniously indicate the user is authenticated when they're not.
  //   Should add a server call to logout the user and clear cookies it set.
  checkAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ConnectionStateActions.checkAuth),
      exhaustMap(() =>
        this.queuebotApiService.checkAuth().pipe(
          map((status) => {
            if (status.status == 'OK') {
              return ConnectionStateActions.authenticated();
            }

            return ConnectionStateActions.refreshAuth();
          }),
          catchError((err: HttpErrorResponse) => {
            if (err.status === 401 || err.status === 403) {
              console.log('got a 401/403');
              // Attempt a refresh.  If that fails, then we're 100% not authenticated.
              return of(ConnectionStateActions.refreshAuth());
            }

            console.log('got a generic error');

            // Any other error is either a server-side problem or connection issue.
            // FIXME: Do a retry on a regular interval of some sort.
            return EMPTY;
          })
        )
      )
    )
  );

  refreshAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ConnectionStateActions.refreshAuth),
      exhaustMap(() =>
        this.queuebotApiService.refreshJwt().pipe(
          map((status) => {
            console.log('refresh ok');
            if (status.status == 'OK') {
              return ConnectionStateActions.authenticated();
            }
            return ConnectionStateActions.notAuthenticated();
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
    private readonly queuebotApiService: QueuebotApiService,
    private actions$: Actions
  ) {}
}
