import { Injectable, Logger } from '@nestjs/common';
import { Worker } from 'worker_threads';
import * as path from 'path';

interface ChatWorkerMessage {
  type: 'connect' | 'disconnect' | 'join' | 'leave' | 'send' | 'shutdown';
  data?: any;
}

interface ChatWorkerResponse {
  type: 'connected' | 'disconnected' | 'joined' | 'left' | 'message' | 'error' | 'ready';
  data?: any;
  error?: string;
}

@Injectable()
export class ChatWorkerManagerService {
  private logger = new Logger(ChatWorkerManagerService.name);
  private worker: Worker | null = null;
  private isConnected = false;
  private currentChannel: string | null = null;

  constructor() {
    this.initializeWorker();
  }

  private initializeWorker() {
    try {
      const workerPath = path.join(__dirname, 'workers', 'chat-worker.js');
      this.worker = new Worker(workerPath, {
        workerData: { workerId: 'main-chat-worker' }
      });

      this.worker.on('message', (response: ChatWorkerResponse) => {
        this.handleWorkerResponse(response);
      });

      this.worker.on('error', (error) => {
        this.logger.error('Chat worker error:', error);
      });

      this.worker.on('exit', (code) => {
        this.logger.log(`Chat worker exited with code ${code}`);
        this.isConnected = false;
        this.currentChannel = null;
      });

      this.logger.log('Chat worker initialized');
    } catch (error) {
      this.logger.error('Failed to initialize chat worker:', error);
    }
  }

  private handleWorkerResponse(response: ChatWorkerResponse) {
    switch (response.type) {
      case 'ready':
        this.logger.log('Chat worker is ready');
        break;
      case 'connected':
        this.isConnected = true;
        this.logger.log('Chat worker connected');
        break;
      case 'disconnected':
        this.isConnected = false;
        this.currentChannel = null;
        this.logger.log('Chat worker disconnected');
        break;
      case 'joined':
        this.currentChannel = response.data?.channel || null;
        this.logger.log(`Chat worker joined channel: ${this.currentChannel}`);
        break;
      case 'left':
        this.currentChannel = null;
        this.logger.log('Chat worker left channel');
        break;
      case 'message':
        this.logger.debug('Received chat message:', response.data);
        // TODO: Forward message to NestJS event system
        break;
      case 'error':
        this.logger.error('Chat worker error:', response.error);
        break;
    }
  }

  private sendMessageToWorker(message: ChatWorkerMessage) {
    if (this.worker) {
      this.worker.postMessage(message);
    } else {
      this.logger.error('Chat worker not initialized');
    }
  }

  async connect(config: any) {
    this.sendMessageToWorker({
      type: 'connect',
      data: config
    });
  }

  async disconnect() {
    this.sendMessageToWorker({
      type: 'disconnect'
    });
  }

  async joinChannel(channelName: string) {
    this.sendMessageToWorker({
      type: 'join',
      data: channelName
    });
  }

  async leaveChannel() {
    this.sendMessageToWorker({
      type: 'leave'
    });
  }

  async sendMessage(messageData: any) {
    this.sendMessageToWorker({
      type: 'send',
      data: messageData
    });
  }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      currentChannel: this.currentChannel
    };
  }

  async shutdown() {
    if (this.worker) {
      this.sendMessageToWorker({
        type: 'shutdown'
      });
      
      // Wait for worker to exit gracefully
      await new Promise<void>((resolve) => {
        if (this.worker) {
          this.worker.on('exit', () => resolve());
          // Force exit after 5 seconds if worker doesn't respond
          setTimeout(() => {
            if (this.worker) {
              this.worker.terminate();
            }
            resolve();
          }, 5000);
        } else {
          resolve();
        }
      });
    }
  }
}


