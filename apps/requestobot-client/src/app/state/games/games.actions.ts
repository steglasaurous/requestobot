import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { GameDto } from '@requestobot/util-dto';
import { HttpErrorResponse } from '@angular/common/http';

export const GamesActions = createActionGroup({
  source: 'Games',
  events: {
    'Get Games': emptyProps(),
    'Get Games Success': props<{ games: GameDto[] }>(),
    'Get Games Fail': props<{ error: HttpErrorResponse }>(),
  },
});
