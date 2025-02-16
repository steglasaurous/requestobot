import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { SongDto, SongRequestDto } from '@requestobot/util-dto';
import { LocalSongState } from '../../models/local-song-state';
import { HttpErrorResponse } from '@angular/common/http';

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
    'Swap Request Order Success': emptyProps(),
    'Swap Request Order Fail': props<{
      songRequestPreviousIndex: number;
      songRequestCurrentIndex: number;
      error: HttpErrorResponse;
    }>(),
    'Delete Request': props<{ songRequestId: number }>(),
    'Delete Request Success': emptyProps(),
    'Delete Request Fail': props<{
      songRequestId: number;
      error: HttpErrorResponse;
    }>(),
    'Set Request Active': props<{ songRequestId: number }>(),
    'Set Request Active Success': props<{ songRequestId: number }>(),
    'Set Request Active Fail': props<{
      songRequestId: number;
      error: HttpErrorResponse;
    }>(),
    'Next Song': emptyProps(),
    'Next Song Fail': props<{ error: HttpErrorResponse }>(),
    'Next Song Success': emptyProps(),
    'Reprocess Songs': emptyProps(),
    Logout: emptyProps(),
  },
});
