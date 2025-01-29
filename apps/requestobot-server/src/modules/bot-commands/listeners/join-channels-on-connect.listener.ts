import { ChatClientConnectedEvent } from '@steglasaurous/chat';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from '../../data-store/entities/channel.entity';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';
import { ChannelManagerService } from '../../channel-manager/services/channel-manager.service';

export class JoinChannelsOnConnectListener {
  private logger: Logger = new Logger(this.constructor.name);
  constructor(
    @InjectRepository(Channel) private channelRepository: Repository<Channel>,
    private channelManagerService: ChannelManagerService
  ) {}
  @OnEvent(ChatClientConnectedEvent.name)
  async handle(chatConnectedEvent: ChatClientConnectedEvent) {
    const channels = await this.channelRepository.find({
      where: { inChannel: true },
    });

    this.logger.log(`Joining ${channels.length} channels`);
    for (const channel of channels) {
      try {
        await this.channelManagerService.joinChannel(channel, false);
      } catch (e) {
        this.logger.warn(
          `Join channel ${channel.channelName} failed: ${e.message}`
        );
      }
    }
  }
}
