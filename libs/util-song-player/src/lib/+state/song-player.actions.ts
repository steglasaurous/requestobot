import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { SongDto } from '@requestobot/util-dto';

export const SongPlayerActions = createActionGroup({
  source: 'SongPlayer',
  events: {
    SetSongAndPlay: props<{ song?: SongDto }>(),
    Play: props<{ song?: SongDto }>(),
    Pause: emptyProps(),
    Stop: emptyProps(),
    ChangePosition: props<{
      change: number;
    }>(),
    ChangeVolume: props<{ volume: number }>(),
    NextTrack: emptyProps(),
    PreviousTrack: emptyProps(),
    Update: props<{ song?: SongDto, playerState?: string, volume?: number }>(),
  },
});
