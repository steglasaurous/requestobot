import { Injectable } from '@angular/core';
import { Observable, from, Subject } from 'rxjs';
import {
  GameDto,
  SongRequestDto,
  ChannelDto,
  AuthValidateDto,
} from '@requestobot/util-dto';

declare global {
  interface Window {
    api?: {
      // Games
      getGames: () => Promise<GameDto[]>;
      
      // Channels
      getChannel: (chatServiceName: string, channelName: string) => Promise<ChannelDto>;
      getChannelById: (channelId: number) => Promise<ChannelDto>;
      createChannel: (chatServiceName: string, channelName: string) => Promise<ChannelDto>;
      joinChannel: (chatServiceName: string, channelName: string) => Promise<ChannelDto>;
      
      // Song Requests
      getSongRequests: (channelId: number, getNextSong?: boolean) => Promise<SongRequestDto[]>;
      swapSongRequestOrder: (channelId: number, sourceId: number, destinationId: number) => Promise<boolean>;
      deleteSongRequest: (channelId: number, songRequestId: number) => Promise<void>;
      
      // Player
      getPlayerState: (channelId: number) => Promise<any>;
      playSong: (channelId: number, songId: number) => Promise<any>;
      pausePlayer: (channelId: number) => Promise<any>;
      stopPlayer: (channelId: number) => Promise<any>;
      setPlayerVolume: (channelId: number, volume: number) => Promise<any>;
      
      // Settings
      getSetting: (channelId: number, settingName: string) => Promise<string>;
      setSetting: (channelId: number, settingName: string, value: string) => Promise<void>;
      
      // Real-time events
      onSongRequestQueueChanged: (callback: (data: any) => void) => void;
      onPlayerStateChange: (callback: (data: any) => void) => void;
      
      // Remove event listeners
      removeAllListeners: (channel: string) => void;
    };
  }
}

@Injectable({
  providedIn: 'root',
})
export class ElectronApiService {
  private songRequestQueueChangedSubject = new Subject<any>();
  private playerStateChangeSubject = new Subject<any>();

  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (window.api) {
      window.api.onSongRequestQueueChanged((data) => {
        this.songRequestQueueChangedSubject.next(data);
      });

      window.api.onPlayerStateChange((data) => {
        this.playerStateChangeSubject.next(data);
      });
    }
  }

  // Games
  getGames(): Observable<GameDto[]> {
    if (window.api) {
      return from(window.api.getGames());
    }
    throw new Error('Electron API not available');
  }

  // Channels
  getChannel(chatServiceName: string, channelName: string): Observable<ChannelDto> {
    if (window.api) {
      return from(window.api.getChannel(chatServiceName, channelName));
    }
    throw new Error('Electron API not available');
  }

  getChannelById(channelId: number): Observable<ChannelDto> {
    if (window.api) {
      return from(window.api.getChannelById(channelId));
    }
    throw new Error('Electron API not available');
  }

  createChannel(chatServiceName: string, channelName: string): Observable<ChannelDto> {
    if (window.api) {
      return from(window.api.createChannel(chatServiceName, channelName));
    }
    throw new Error('Electron API not available');
  }

  joinChannel(chatServiceName: string, channelName: string): Observable<ChannelDto> {
    if (window.api) {
      return from(window.api.joinChannel(chatServiceName, channelName));
    }
    throw new Error('Electron API not available');
  }

  // Song Requests
  getSongRequests(channelId: number, getNextSong?: boolean): Observable<SongRequestDto[]> {
    if (window.api) {
      return from(window.api.getSongRequests(channelId, getNextSong));
    }
    throw new Error('Electron API not available');
  }

  swapSongRequestOrder(channelId: number, sourceId: number, destinationId: number): Observable<boolean> {
    if (window.api) {
      return from(window.api.swapSongRequestOrder(channelId, sourceId, destinationId));
    }
    throw new Error('Electron API not available');
  }

  deleteSongRequest(channelId: number, songRequestId: number): Observable<void> {
    if (window.api) {
      return from(window.api.deleteSongRequest(channelId, songRequestId));
    }
    throw new Error('Electron API not available');
  }

  // Player
  getPlayerState(channelId: number): Observable<any> {
    if (window.api) {
      return from(window.api.getPlayerState(channelId));
    }
    throw new Error('Electron API not available');
  }

  playSong(channelId: number, songId: number): Observable<any> {
    if (window.api) {
      return from(window.api.playSong(channelId, songId));
    }
    throw new Error('Electron API not available');
  }

  pausePlayer(channelId: number): Observable<any> {
    if (window.api) {
      return from(window.api.pausePlayer(channelId));
    }
    throw new Error('Electron API not available');
  }

  stopPlayer(channelId: number): Observable<any> {
    if (window.api) {
      return from(window.api.stopPlayer(channelId));
    }
    throw new Error('Electron API not available');
  }

  setPlayerVolume(channelId: number, volume: number): Observable<any> {
    if (window.api) {
      return from(window.api.setPlayerVolume(channelId, volume));
    }
    throw new Error('Electron API not available');
  }

  // Settings
  getSetting(channelId: number, settingName: string): Observable<string> {
    if (window.api) {
      return from(window.api.getSetting(channelId, settingName));
    }
    throw new Error('Electron API not available');
  }

  setSetting(channelId: number, settingName: string, value: string): Observable<void> {
    if (window.api) {
      return from(window.api.setSetting(channelId, settingName, value));
    }
    throw new Error('Electron API not available');
  }

  // Real-time events
  get songRequestQueueChanged$(): Observable<any> {
    return this.songRequestQueueChangedSubject.asObservable();
  }

  get playerStateChange$(): Observable<any> {
    return this.playerStateChangeSubject.asObservable();
  }

  // Cleanup
  ngOnDestroy() {
    if (window.api) {
      window.api.removeAllListeners('event:songRequestQueueChanged');
      window.api.removeAllListeners('event:playerStateChange');
    }
  }
}
