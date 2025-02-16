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
import { channelReducer } from './state/channel/channel.reducer';
import { ChannelEffects } from './state/channel/channel.effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { GamesEffects } from './state/games/games.effects';
import { gamesReducer } from './state/games/games.reducer';
import { AuthEffects } from './state/auth/auth.effects';
import { authReducer } from './state/auth/auth.reducer';
import { settingsReducer } from './state/settings/settings.reducer';
import { SettingsEffects } from './state/settings/settings.effects';
import { songRequestsReducer } from './state/song-requests/song-requests.reducer';
import { SongRequestsEffects } from './state/song-requests/song-requests.effects';
import { WebsocketService } from './services/websocket.service';
import { provideToastr } from 'ngx-toastr';
import { WebsocketEffects } from './state/websocket/websocket.effects';
import { websocketReducer } from './state/websocket/websocket.reducer';
export const QUEUEBOT_API_BASE_URL = 'queuebot_api_base_url';
export const WEBSOCKET_URL = 'websocket_url';

export const appConfig: ApplicationConfig = {
  providers: [
    provideEffects(
      ChannelEffects,
      GamesEffects,
      AuthEffects,
      SettingsEffects,
      SongRequestsEffects,
      WebsocketEffects
    ),
    provideStore({
      channel: channelReducer,
      games: gamesReducer,
      auth: authReducer,
      settings: settingsReducer,
      songRequests: songRequestsReducer,
      websocket: websocketReducer,
    }),
    provideStoreDevtools({ logOnly: !isDevMode() }),
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
    {
      provide: 'WebsocketService',
      useFactory: () => {
        return new WebsocketService(environment.websocketUrl);
      },
    },
    provideToastr({
      positionClass: 'toast-bottom-center',
    }),
  ],
};
