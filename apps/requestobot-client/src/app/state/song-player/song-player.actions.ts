import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const SongPlayerActions = createActionGroup({
  source: 'SongPlayer',
  events: {
    Play: props<{ songId?: number }>(),
    Pause: emptyProps(),
    Stop: emptyProps(),
    VolumeChange: props<{ volume: number }>(),
  },
});
