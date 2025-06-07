import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { SongDto } from '@requestobot/util-dto';

export const SongPlayerActions = createActionGroup({
  source: 'SongPlayer',
  events: {
    SetSongAndPlay: props<{ song: SongDto }>(),
    Play: emptyProps(),
    Pause: emptyProps(),
    Stop: emptyProps(),
    ChangePosition: props<{
      change: number;
    }>(),
    ChangeVolume: props<{ volume: number }>(),
  },
});
