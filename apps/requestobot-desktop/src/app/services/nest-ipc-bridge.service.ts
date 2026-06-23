import { Injectable, Logger } from '@nestjs/common';
import { ipcMain, BrowserWindow } from 'electron';
import { AppModule } from '../../../../requestobot-server/src/app.module';
import { NestFactory } from '@nestjs/core';
import { GameController } from '../../../../requestobot-server/src/modules/api/controllers/game.controller';
import { ChannelController } from '../../../../requestobot-server/src/modules/api/controllers/channel.controller';
import { SongRequestsController } from '../../../../requestobot-server/src/modules/api/controllers/song-requests.controller';
import { PlayerController } from '../../../../requestobot-server/src/modules/api/controllers/player.controller';
import { SettingController } from '../../../../requestobot-server/src/modules/api/controllers/setting.controller';
import { ChatWorkerManagerService } from './chat-worker-manager.service';

@Injectable()
export class NestIpcBridgeService {
  private logger = new Logger(NestIpcBridgeService.name);
  private app: any;
  private mainWindow: BrowserWindow;
  private chatWorkerManager: ChatWorkerManagerService;

  constructor() {
    this.chatWorkerManager = new ChatWorkerManagerService();
    this.setupIpcHandlers();
  }

  async initialize(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
    
    try {
      // Create NestJS application context (no HTTP server)
      this.app = await NestFactory.createApplicationContext(AppModule, {
        logger: ['error', 'warn', 'log'],
      });
      
      this.logger.log('NestJS application context initialized successfully');
      
      // Set up real-time event forwarding
      this.setupEventForwarding();
      
    } catch (error) {
      this.logger.error('Failed to initialize NestJS application context', error);
      throw error;
    }
  }

  private setupIpcHandlers() {
    // Games API
    ipcMain.handle('api:games:get', async () => {
      try {
        const gameController = this.app.get(GameController);
        return await gameController.getGames();
      } catch (error) {
        this.logger.error('Error in games:get', error);
        throw error;
      }
    });

    // Channels API
    ipcMain.handle('api:channels:get', async (event, chatServiceName: string, channelName: string) => {
      try {
        const channelController = this.app.get(ChannelController);
        return await channelController.getChannelDetails(chatServiceName, channelName);
      } catch (error) {
        this.logger.error('Error in channels:get', error);
        throw error;
      }
    });

    ipcMain.handle('api:channels:getById', async (event, channelId: number) => {
      try {
        const channelController = this.app.get(ChannelController);
        return await channelController.getChannelDetailsById(channelId);
      } catch (error) {
        this.logger.error('Error in channels:getById', error);
        throw error;
      }
    });

    ipcMain.handle('api:channels:create', async (event, chatServiceName: string, channelName: string) => {
      try {
        const channelController = this.app.get(ChannelController);
        return await channelController.createChannel(chatServiceName, channelName);
      } catch (error) {
        this.logger.error('Error in channels:create', error);
        throw error;
      }
    });

    ipcMain.handle('api:channels:join', async (event, chatServiceName: string, channelName: string) => {
      try {
        const channelController = this.app.get(ChannelController);
        return await channelController.joinChannel(chatServiceName, channelName);
      } catch (error) {
        this.logger.error('Error in channels:join', error);
        throw error;
      }
    });

    // Song Requests API
    ipcMain.handle('api:song-requests:get', async (event, channelId: number, getNextSong?: boolean) => {
      try {
        const songRequestsController = this.app.get(SongRequestsController);
        return await songRequestsController.getSongRequestQueue(channelId, getNextSong);
      } catch (error) {
        this.logger.error('Error in song-requests:get', error);
        throw error;
      }
    });

    ipcMain.handle('api:song-requests:swap', async (event, channelId: number, sourceId: number, destinationId: number) => {
      try {
        const songRequestsController = this.app.get(SongRequestsController);
        return await songRequestsController.swapOrder(channelId, sourceId, destinationId);
      } catch (error) {
        this.logger.error('Error in song-requests:swap', error);
        throw error;
      }
    });

    ipcMain.handle('api:song-requests:delete', async (event, channelId: number, songRequestId: number) => {
      try {
        const songRequestsController = this.app.get(SongRequestsController);
        return await songRequestsController.deleteSongRequest(channelId, songRequestId);
      } catch (error) {
        this.logger.error('Error in song-requests:delete', error);
        throw error;
      }
    });

    // Player API
    ipcMain.handle('api:player:get', async (event, channelId: number) => {
      try {
        const playerController = this.app.get(PlayerController);
        return await playerController.getPlayerState(channelId);
      } catch (error) {
        this.logger.error('Error in player:get', error);
        throw error;
      }
    });

    ipcMain.handle('api:player:play', async (event, channelId: number, songId: number) => {
      try {
        const playerController = this.app.get(PlayerController);
        return await playerController.playSong(channelId, songId);
      } catch (error) {
        this.logger.error('Error in player:play', error);
        throw error;
      }
    });

    ipcMain.handle('api:player:pause', async (event, channelId: number) => {
      try {
        const playerController = this.app.get(PlayerController);
        return await playerController.pausePlayer(channelId);
      } catch (error) {
        this.logger.error('Error in player:pause', error);
        throw error;
      }
    });

    ipcMain.handle('api:player:stop', async (event, channelId: number) => {
      try {
        const playerController = this.app.get(PlayerController);
        return await playerController.stopPlayer(channelId);
      } catch (error) {
        this.logger.error('Error in player:stop', error);
        throw error;
      }
    });

    ipcMain.handle('api:player:setVolume', async (event, channelId: number, volume: number) => {
      try {
        const playerController = this.app.get(PlayerController);
        return await playerController.setVolume(channelId, volume);
      } catch (error) {
        this.logger.error('Error in player:setVolume', error);
        throw error;
      }
    });

    // Settings API
    ipcMain.handle('api:settings:get', async (event, channelId: number, settingName: string) => {
      try {
        const settingController = this.app.get(SettingController);
        return await settingController.getSetting(channelId, settingName);
      } catch (error) {
        this.logger.error('Error in settings:get', error);
        throw error;
      }
    });

    ipcMain.handle('api:settings:set', async (event, channelId: number, settingName: string, value: string) => {
      try {
        const settingController = this.app.get(SettingController);
        return await settingController.setSetting(channelId, settingName, value);
      } catch (error) {
        this.logger.error('Error in settings:set', error);
        throw error;
      }
    });

    this.logger.log('IPC handlers registered successfully');
  }

  private setupEventForwarding() {
    // Set up event forwarding from NestJS to renderer process
    // This replaces the WebSocket gateway functionality
    
    // Get the event emitter from NestJS app
    const eventEmitter = this.app.get('EventEmitter2');
    
    if (eventEmitter) {
      // Listen for song request queue changes
      eventEmitter.on('songRequestQueueChanged', (event: any) => {
        if (this.mainWindow && !this.mainWindow.isDestroyed()) {
          this.mainWindow.webContents.send('event:songRequestQueueChanged', event);
        }
      });

      // Listen for player state changes
      eventEmitter.on('playerStateChangeEvent', (event: any) => {
        if (this.mainWindow && !this.mainWindow.isDestroyed()) {
          this.mainWindow.webContents.send('event:playerStateChange', event);
        }
      });

      this.logger.log('Event forwarding setup completed');
    } else {
      this.logger.warn('EventEmitter2 not found, event forwarding disabled');
    }
  }

  async shutdown() {
    if (this.chatWorkerManager) {
      await this.chatWorkerManager.shutdown();
    }
    
    if (this.app) {
      await this.app.close();
      this.logger.log('NestJS application context closed');
    }
  }
}
