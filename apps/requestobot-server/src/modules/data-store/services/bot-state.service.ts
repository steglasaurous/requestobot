import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserBotState } from '../entities/user-bot-state.entity';
import { Repository } from 'typeorm';
import { Channel } from '../entities/channel.entity';

@Injectable()
export class BotStateService {
  private logger: Logger = new Logger(this.constructor.name);

  constructor(
    @InjectRepository(UserBotState)
    private userBotStateRepository: Repository<UserBotState>,
    @InjectRepository(Channel) private channelRepository: Repository<Channel>,
  ) {}

  async getState(requesterName: string, channelName: string) {
    const channel = await this.channelRepository.findOneBy({
      channelName: channelName,
    });
    if (!channel) {
      this.logger.warn(
        'channelName was not found in database, cannot get user state',
        { requesterName: requesterName, channelName: channelName },
      );
      return;
    }
    let userState = await this.userBotStateRepository.findOneBy({
      requesterName: requesterName,
      channel: channel,
    });

    if (!userState) {
      userState = new UserBotState();
      userState.channel = channel;
      userState.requesterName = requesterName;
      userState.timestamp = new Date();
    }

    return userState;
  }

  async setState(requesterName: string, channelName: string, state: any) {
    const channel = await this.channelRepository.findOneBy({
      channelName: channelName,
    });
    if (!channel) {
      this.logger.warn(
        'channelName was not found in database, cannot get user state',
        { requesterName: requesterName, channelName: channelName },
      );
      return;
    }

    let userBotState: UserBotState = await this.getState(
      requesterName,
      channelName,
    );
    if (!userBotState) {
      userBotState = new UserBotState();
      userBotState.requesterName = requesterName;
      userBotState.channel = channel;
    }

    userBotState.state = state;
    userBotState.timestamp = new Date();

    return await this.userBotStateRepository.save(userBotState);
  }
}
