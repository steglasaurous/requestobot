import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ChannelDto, GameDto } from '@requestobot/util-dto';
import { HttpErrorResponse } from '@angular/common/http';

export const ChannelActions = createActionGroup({
  source: 'Channel',
  events: {
    'Load Channel': props<{ chatServiceName: string; channelName: string }>(),
    'Load Channel Success': props<{ channel: ChannelDto }>(),
    'Load Channel Fail': props<{
      chatServiceName: string;
      channelName: string;
      error: HttpErrorResponse;
    }>(),
    'Create Channel': props<{ chatServiceName: string; channelName: string }>(),
    'Create Channel Success': emptyProps(),
    'Create Channel Fail': props<{
      chatServiceName: string;
      channelName: string;
      error: HttpErrorResponse;
    }>(),
    'Join Channel': emptyProps(),
    'Join Channel Success': emptyProps(),
    'Join Channel Fail': props<{ error: HttpErrorResponse }>(),
    'Clear Queue': emptyProps(),
    'Clear Queue Success': emptyProps(),
    'Clear Queue Fail': props<{ error: HttpErrorResponse }>(),
    'Open Queue': emptyProps(),
    'Open Queue Success': emptyProps(),
    'Open Queue Fail': props<{ error: HttpErrorResponse }>(),
    'Close Queue': emptyProps(),
    'Close Queue Success': emptyProps(),
    'Close Queue Fail': props<{ error: HttpErrorResponse }>(),
    'Set Game': props<{ game: GameDto }>(),
    'Set Game Success': emptyProps(),
    'Set Game Fail': props<{ error: HttpErrorResponse }>(),
    'Set Setting': props<{ settingName: string; value: string }>(),
    'Set Setting Success': emptyProps(),
    'Set Setting Fail': props<{ error: HttpErrorResponse }>(),
    'Enable Bot': emptyProps(),
    'Enable Bot Success': emptyProps(),
    'Enable Bot Fail': props<{ error: HttpErrorResponse }>(),
    'Disable Bot': emptyProps(),
    'Disable Bot Success': emptyProps(),
    'Disable Bot Fail': props<{ error: HttpErrorResponse }>(),
    Logout: emptyProps(),
  },
});
