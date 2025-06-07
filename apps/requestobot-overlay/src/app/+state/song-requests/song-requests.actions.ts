import { createActionGroup, props } from '@ngrx/store';
import { SongRequestDto } from '@requestobot/util-dto';

export const SongRequestsActions = createActionGroup({
  source: 'SongRequests',
  events: {
    'Update Queue': props<{ songRequests: SongRequestDto[] }>(),
  },
});
