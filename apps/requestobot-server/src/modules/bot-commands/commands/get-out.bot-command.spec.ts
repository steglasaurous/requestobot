import { Test, TestingModule } from '@nestjs/testing';
import {
  getGenericNestMock,
  getMockChannel,
  getMockChatMessage,
} from '../../../../test/helpers';
import { GetOutBotCommand } from './get-out.bot-command';
import { ChannelManagerService } from '../../channel-manager/services/channel-manager.service';

describe('Get out bot command', () => {
  let service: GetOutBotCommand;
  let channel;
  let chatMessage;
  let channelManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GetOutBotCommand],
    })
      .useMocker((token) => {
        switch (token) {
          default:
            return getGenericNestMock(token);
        }
      })
      .compile();

    service = module.get(GetOutBotCommand);
    channel = getMockChannel();
    chatMessage = getMockChatMessage();
    channelManager = module.get(ChannelManagerService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return a description of the command', () => {
    expect(service.getDescription().length).toBeGreaterThan(1);
  });

  it('should close the queue if it is open, and the user is a broadcaster', async () => {
    channel.inChannel = true;
    channel.lang = 'en';

    chatMessage.userIsBroadcaster = true;

    const response = await service.execute(channel, chatMessage);

    expect(response).toEqual(undefined);
    expect(channelManager.leaveChannel).toHaveBeenCalledWith(channel);
  });

  it('should ignore the command if user is not a broadcaster or mod', async () => {
    chatMessage.userIsBroadcaster = false;
    chatMessage.userIsMod = false;

    await service.execute(channel, chatMessage);
    expect(channelManager.leaveChannel).not.toHaveBeenCalled();
  });

  it('should always trigger regardless if the bot is enabled or not', () => {
    expect(service.shouldAlwaysTrigger()).toBeTruthy();
  });
});
