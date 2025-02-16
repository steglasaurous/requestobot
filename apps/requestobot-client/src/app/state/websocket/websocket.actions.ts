import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const WebsocketActions = createActionGroup({
  source: 'Websocket',
  events: {
    Enable: emptyProps(),
    Disable: emptyProps(),
    Connected: emptyProps(),
    Disconnected: emptyProps(),
    ConnectionError: props<{ message: string }>(),
  },
});
