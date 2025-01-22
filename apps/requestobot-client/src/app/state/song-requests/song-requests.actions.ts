import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { SongDto, SongRequestDto } from '@requestobot/util-dto';
import { LocalSongState } from '../../models/local-song-state';

export const SongRequestsActions = createActionGroup({
  source: 'SongRequests',
  events: {
    'Get Queue': emptyProps(),
    'Update Queue': props<{ songRequests: SongRequestDto[] }>(),
    'Connect Websocket': emptyProps(),
    'Disconnect Websocket': emptyProps(),
    'Process Song': props<{ song: SongDto }>(),
    'Update Song Download Progress': props<{ songState: LocalSongState }>(),
    'Swap Request Order': props<{
      songRequestPreviousIndex: number;
      songRequestCurrentIndex: number;
    }>(),
    'Delete Request': props<{ songRequestId: number }>(),
    'Set Request Active': props<{ songRequestId: number }>(),
    'Next Song': emptyProps(),
    'Next Song Complete': emptyProps(),
    'Reprocess Songs': emptyProps(),
  },
});
