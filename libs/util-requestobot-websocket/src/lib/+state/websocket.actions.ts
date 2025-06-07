import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const WebsocketActions = createActionGroup({
  source: 'Websocket',
  events: {
    Enable: emptyProps(),
    Disable: emptyProps(),
    Connect: props<{
      uri: string;
      chatServiceName: string;
      channelName: string;
    }>(),
    Connected: emptyProps(),
    Disconnected: emptyProps(),
    ConnectionError: props<{ message: string }>(),
    WebsocketEvent: props<{ event: string; data: any }>(),
  },
});
