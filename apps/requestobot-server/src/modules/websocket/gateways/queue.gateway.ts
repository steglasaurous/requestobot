import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from '../../data-store/entities/channel.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from '@nestjs/common';
import { SongRequestService } from '../../song-request/services/song-request.service';
import { QueueDto, SongRequestDto } from '@requestobot/util-dto';
import { OnEvent } from '@nestjs/event-emitter';
import { DtoMappingService } from '../../data-store/services/dto-mapping.service';
import { SongRequestQueueChangedEvent } from '../../song-request/events/song-request-queue-changed.event';

@WebSocketGateway({})
export class QueueGateway implements OnGatewayDisconnect, OnGatewayConnection {
  // Maps to client OBJECT
  private channelToClientMap: Map<string, Set<any>> = new Map<
    string,
    Set<any>
  >();

  // Maps client ID to channel names
  private clientIdToChannelMap: Map<string, string> = new Map<string, string>();

  private logger: Logger = new Logger(this.constructor.name);

  constructor(
    @InjectRepository(Channel) private channelRepository: Repository<Channel>,
    private songRequestService: SongRequestService,
    private dtoMappingService: DtoMappingService,
  ) {}

  @SubscribeMessage('subscribe')
  async subscribeToChannel(
    @ConnectedSocket() client,
    @MessageBody('channelName')
    channelName: string,
  ): Promise<WsResponse> {
    const channel = await this.channelRepository.findOneBy({
      channelName: channelName,
    });
    if (!channel) {
      this.logger.log('Subscribe failed - channel not provided', {
        clientId: client.id,
      });

      return {
        event: 'subscribe',
        data: {
          success: false,
          reason: 'Channel does not exist',
          channelName: channelName,
        },
      } as WsResponse;
    }

    this.subscribeClientToChannel(client, channelName);

    this.logger.log('Channel subscribed', {
      clientId: client.id,
      channelName: channelName,
    });

    return await this.handleQueueEvent(client);
  }

  private subscribeClientToChannel(client: any, channelName: string) {
    if (!this.channelToClientMap.has(channelName)) {
      this.channelToClientMap.set(channelName, new Set<any>());
    }

    this.channelToClientMap.get(channelName).add(client);
    this.clientIdToChannelMap.set(client.id, channelName);
  }

  handleDisconnect(client: any): any {
    if (this.clientIdToChannelMap.has(client.id)) {
      this.channelToClientMap
        .get(this.clientIdToChannelMap.get(client.id))
        .delete(client.id);

      this.clientIdToChannelMap.delete(client.id);

      this.logger.log('Cleared subscriptions for user', {
        clientId: client.id,
      });
      return;
    }
    this.logger.log('No subscriptions to clear for user', {
      clientId: client.id,
    });

    this.logger.log('Disconnected', {
      clientId: client.id,
    });
  }

  handleConnection(client: any, ...args: any[]): any {
    // Assign a unique id to this client so I can figure out how to deal with it in maps.
    client.id = uuidv4();

    this.logger.log('Websocket client connected', { clientId: client.id });
  }

  @SubscribeMessage('queue')
  async handleQueueEvent(@ConnectedSocket() client: any) {
    if (this.clientIdToChannelMap.has(client.id)) {
      const channel = await this.channelRepository.findOneBy({
        channelName: this.clientIdToChannelMap.get(client.id),
      });
      const songRequests =
        await this.songRequestService.getAllRequests(channel);

      const songRequestsDtos: SongRequestDto[] = songRequests.map(
        (songRequest) => {
          return this.dtoMappingService.songRequestToDto(songRequest);
        },
      );

      const queueDto: QueueDto = {
        channelName: channel.channelName,
        gameDisplayName: channel.game.displayName,
        songRequests: songRequestsDtos,
      };

      return <WsResponse>{
        event: 'queue',
        data: queueDto,
      };
    }

    return <WsResponse>{
      event: 'error',
      data: {
        errorId: 1,
        errorDescription:
          "Not subscribed to a channel. Use the subscribe event to subscribe to a channel's queue",
      },
    };
  }

  @OnEvent(SongRequestQueueChangedEvent.name)
  handleQueueChange(event: SongRequestQueueChangedEvent) {
    const output = [];
    for (const songRequest of event.songRequests) {
      output.push(this.dtoMappingService.songRequestToDto(songRequest));
    }
    this.sendMessageToChannelSubscribers(event.channel.channelName, {
      event: 'songRequestQueueChanged',
      data: output,
    });
  }

  private sendMessageToChannelSubscribers(channelName: string, message: any) {
    this.getClientsSubscribedToChannel(channelName).forEach((client) => {
      this.logger.debug('WS message to client', {
        clientId: client.id,
        message: message,
      });
      client.send(JSON.stringify(message));
    });
  }

  private getClientsSubscribedToChannel(channelName: string): Set<any> {
    if (this.channelToClientMap.has(channelName)) {
      return this.channelToClientMap.get(channelName);
    }
    return new Set<any>();
  }
}
