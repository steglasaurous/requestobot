import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { GameDto } from '@requestobot/util-dto';

export const GamesActions = createActionGroup({
  source: 'Games',
  events: {
    'Get Games': emptyProps(),
    'Get Games Success': props<{ games: GameDto[] }>(),
  },
});
