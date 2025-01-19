import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QUEUEBOT_API_BASE_URL } from '../app.config';
import {
  GameDto,
  SongRequestDto,
  ChannelDto,
  AuthValidateDto,
} from '@requestobot/util-dto';

@Injectable({
  providedIn: 'root',
})
export class QueuebotApiService {
  constructor(
    @Inject(QUEUEBOT_API_BASE_URL) private apiBaseUrl: string,
    private httpClient: HttpClient
  ) {}

  getAuthCodeResult(authCode: string): Observable<any> {
    return this.httpClient.get<any>(`${this.apiBaseUrl}/auth-code/${authCode}`);
  }
  getSongRequestQueue(channelId: number): Observable<SongRequestDto[]> {
    return this.httpClient.get<SongRequestDto[]>(
      `${this.apiBaseUrl}/api/channels/${channelId}/song-requests`,
      { withCredentials: true }
    );
  }

  getChannel(
    chatServiceName: string,
    channelName: string
  ): Observable<ChannelDto> {
    return this.httpClient.get<ChannelDto>(
      `${this.apiBaseUrl}/api/channels/${chatServiceName}/${channelName}`,
      {
        withCredentials: true,
      }
    );
  }

  createChannel(
    chatServiceName: string,
    channelName: string
  ): Observable<ChannelDto> {
    return this.httpClient.post<ChannelDto>(
      `${this.apiBaseUrl}/api/channels`,
      {
        channelName: channelName,
        chatServiceName: chatServiceName,
        inChannel: true,
        enabled: true,
        queueOpen: true,
      },
      {
        withCredentials: true,
      }
    );
  }

  // FIXME: consider changing this to use channelId instead.
  joinChannel(
    chatServiceName: string,
    channelName: string
  ): Observable<ChannelDto> {
    return this.httpClient.put<ChannelDto>(
      `${this.apiBaseUrl}/api/channels/${chatServiceName}/${channelName}`,
      {
        inChannel: true,
      },
      {
        withCredentials: true,
      }
    );
  }

  swapOrder(
    channelId: number,
    sourceSongRequestId: number,
    destinationSongRequestId: number
  ): Observable<boolean> {
    return this.httpClient.put<boolean>(
      `${this.apiBaseUrl}/api/channels/${channelId}/song-requests/${sourceSongRequestId}/swapOrder`,
      {
        songRequestId: destinationSongRequestId,
      },
      {
        withCredentials: true,
      }
    );
  }

  deleteSongRequest(
    channelId: number,
    songRequestId: number
  ): Observable<boolean> {
    return this.httpClient.delete<boolean>(
      `${this.apiBaseUrl}/api/channels/${channelId}/song-requests/${songRequestId}`,
      {
        withCredentials: true,
      }
    );
  }

  nextSong(channelId: number): Observable<SongRequestDto | undefined> {
    return this.httpClient.put<SongRequestDto>(
      `${this.apiBaseUrl}/api/channels/${channelId}/song-requests/next-song`,
      {},
      {
        withCredentials: true,
      }
    );
  }

  setSongRequestActive(
    channelId: number,
    songRequestId: number
  ): Observable<SongRequestDto> {
    return this.httpClient.put<SongRequestDto>(
      `${this.apiBaseUrl}/api/channels/${channelId}/song-requests/${songRequestId}`,
      {
        songRequestId: songRequestId,
        isActive: true,
      },
      {
        withCredentials: true,
      }
    );
  }

  closeQueue(channelId: number): Observable<ChannelDto> {
    return this.httpClient.put<ChannelDto>(
      `${this.apiBaseUrl}/api/channels/${channelId}`,
      {
        queueOpen: false,
      },
      {
        withCredentials: true,
      }
    );
  }

  openQueue(channelId: number): Observable<ChannelDto> {
    return this.httpClient.put<ChannelDto>(
      `${this.apiBaseUrl}/api/channels/${channelId}`,
      {
        queueOpen: true,
      },
      {
        withCredentials: true,
      }
    );
  }

  getGames(): Observable<GameDto[]> {
    return this.httpClient.get<GameDto[]>(`${this.apiBaseUrl}/api/games`);
  }

  setGame(channelId: number, gameId: number) {
    return this.httpClient.put<ChannelDto>(
      `${this.apiBaseUrl}/api/channels/${channelId}`,
      {
        game: { id: gameId },
      },
      {
        withCredentials: true,
      }
    );
  }

  clearQueue(channelId: number) {
    return this.httpClient.delete(
      `${this.apiBaseUrl}/api/channels/${channelId}/song-requests`,
      { withCredentials: true }
    );
  }

  setSetting(channelId: number, settingName: string, value: string) {
    return this.httpClient.put(
      `${this.apiBaseUrl}/api/channels/${channelId}/settings/${settingName}`,
      {
        value: value,
      },
      {
        withCredentials: true,
      }
    );
  }

  checkAuth(): Observable<AuthValidateDto> {
    return this.httpClient.get<AuthValidateDto>(
      `${this.apiBaseUrl}/auth/validate`,
      {
        withCredentials: true,
      }
    );
  }

  refreshJwt(): Observable<AuthValidateDto> {
    return this.httpClient.get<AuthValidateDto>(
      `${this.apiBaseUrl}/auth/refresh`,
      {
        withCredentials: true,
      }
    );
  }

  logout() {
    return this.httpClient.get(`${this.apiBaseUrl}/auth/logout`, {
      withCredentials: true,
    });
  }
}
