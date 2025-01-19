import {
  ApplicationConfig,
  provideZoneChangeDetection,
  isDevMode,
} from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { channelReducer } from './state/channel.reducer';
import { ChannelEffects } from './state/channel.effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { connectionStateReducer } from './state/connection-state.reducer';
import { ConnectionStateEffects } from './state/connection-state.effects';
import { GamesEffects } from './state/games.effects';
import { gamesReducer } from './state/games.reducer';
import { AuthEffects } from './state/auth.effects';
import { authReducer } from './state/auth.reducer';
export const QUEUEBOT_API_BASE_URL = 'queuebot_api_base_url';
export const WEBSOCKET_URL = 'websocket_url';

export const appConfig: ApplicationConfig = {
  providers: [
    provideStoreDevtools({ logOnly: !isDevMode() }),
    provideEffects(
      ChannelEffects,
      ConnectionStateEffects,
      GamesEffects,
      AuthEffects
    ),
    provideStore({
      channel: channelReducer,
      connectionState: connectionStateReducer,
      games: gamesReducer,
      auth: authReducer,
    }),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withHashLocation()),
    {
      provide: QUEUEBOT_API_BASE_URL,
      useValue: environment.queuebotApiBaseUrl,
    },
    provideAnimations(),
    {
      provide: WEBSOCKET_URL,
      useValue: environment.websocketUrl,
    },
    provideHttpClient(),
    provideAnimationsAsync(),
  ],
};
