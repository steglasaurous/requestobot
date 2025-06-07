import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideStore } from '@ngrx/store';
import {
  WebsocketEffects,
  websocketReducer,
} from '@requestobot/util-requestobot-websocket';
import { provideEffects } from '@ngrx/effects';
import { songPlayerReducer } from './+state/song-player/song-player.reducer';
import { SongPlayerEffects } from './+state/song-player/song-player.effects';
import { songRequestsReducer } from './+state/song-requests/song-requests.reducer';
import { SongRequestsEffects } from './+state/song-requests/song-requests.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideStore({
      websocket: websocketReducer,
      songPlayer: songPlayerReducer,
      songRequests: songRequestsReducer,
    }),
    provideEffects(WebsocketEffects, SongPlayerEffects, SongRequestsEffects),
  ],
};
