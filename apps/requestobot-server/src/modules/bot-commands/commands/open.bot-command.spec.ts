import { Test, TestingModule } from '@nestjs/testing';
import {
  getGenericNestMock,
  getMockChannel,
  getMockChatMessage,
} from '../../../../test/helpers';
import { I18nService } from 'nestjs-i18n';
import { OpenBotCommand } from './open.bot-command';

describe('Open bot command', () => {
  const channelRepositoryMock = {
    save: jest.fn(),
    findOneBy: jest.fn(),
  };
  let service: OpenBotCommand;
  let i18n;

  let channel;
  let chatMessage;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OpenBotCommand],
    })
      .useMocker((token) => {
        switch (token) {
          case 'ChannelRepository':
            return channelRepositoryMock;
          default:
            return getGenericNestMock(token);
        }
      })
      .compile();

    service = module.get(OpenBotCommand);
    i18n = module.get(I18nService);

    channel = getMockChannel();
    channel.queueOpen = false;

    chatMessage = getMockChatMessage();
    chatMessage.userIsBroadcaster = true;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return a description of the command', () => {
    expect(service.getDescription().length).toBeGreaterThan(1);
  });

  it('should open the queue if it is closed', async () => {
    const response = await service.execute(channel, chatMessage);

    expect(response).toEqual('chat.QueueOpen');
    expect(i18n.t).toHaveBeenCalledWith('chat.QueueOpen', {
      lang: 'en',
    });
    expect(channelRepositoryMock.save).toHaveBeenCalled();
    expect(channelRepositoryMock.save.mock.calls[0][0].queueOpen).toBeTruthy();
  });

  it('should return a message indicating the queue is already open', async () => {
    channel.queueOpen = true;

    const response = await service.execute(channel, chatMessage);
    expect(response).toEqual('chat.QueueAlreadyOpen');
    expect(i18n.t).toHaveBeenCalledWith('chat.QueueAlreadyOpen', {
      lang: 'en',
    });
    expect(channelRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should not respond if the user is not a broadcaster or moderator', async () => {
    chatMessage.userIsBroadcaster = false;
    chatMessage.userIsMod = false;

    const response = await service.execute(channel, chatMessage);
    expect(response).toBeUndefined();
    expect(channelRepositoryMock.save).not.toHaveBeenCalled();
  });
});
