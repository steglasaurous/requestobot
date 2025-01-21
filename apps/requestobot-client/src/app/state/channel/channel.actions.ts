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
    'Join Channel': emptyProps(),
    'Join Channel Success': emptyProps(),
    'Clear Queue': emptyProps(),
    'Clear Queue Success': emptyProps(),
    'Open Queue': emptyProps(),
    'Open Queue Success': emptyProps(),
    'Close Queue': emptyProps(),
    'Close Queue Success': emptyProps(),
    'Set Game': props<{ game: GameDto }>(),
    'Set Game Success': emptyProps(),
    'Set Setting': props<{ settingName: string; value: string }>(),
    'Set Setting Success': emptyProps(),
    'Enable Bot': emptyProps(),
    'Enable Bot Success': emptyProps(),
    'Disable Bot': emptyProps(),
    'Disable Bot Success': emptyProps(),
  },
});
