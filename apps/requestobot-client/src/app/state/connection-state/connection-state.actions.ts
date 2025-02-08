import { createActionGroup, emptyProps } from '@ngrx/store';

export const ConnectionStateActions = createActionGroup({
  source: 'Connection',
  events: {
    'Check Auth': emptyProps(),
    'Not Authenticated': emptyProps(),
    Authenticated: emptyProps(),
    'Refresh Auth': emptyProps(),
    'Connection Failure': emptyProps(),
  },
});
