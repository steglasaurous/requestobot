import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    Logout: emptyProps(),
    'Submit Auth Code': props<{ authCode: string }>(),
    'Login Success': props<{ username: string }>(),
    'Login Fail': emptyProps(),
    'Check Auth': emptyProps(),
    'Not Authenticated': emptyProps(),
    Authenticated: emptyProps(),
    'Refresh Auth': emptyProps(),
    'Connection Failure': emptyProps(),
  },
});
