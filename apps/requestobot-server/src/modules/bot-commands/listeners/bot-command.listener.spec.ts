import { Test, TestingModule } from '@nestjs/testing';
import { BotCommandListener } from './bot-command.listener';
import {
  getGenericNestMock,
  getMockChannel,
  getMockChatMessage,
} from '../../../../test/helpers';
import { getToken } from '@willsoto/nestjs-prometheus';
import { Metrics } from '../models/metrics.enum';
import { Channel } from '../../data-store/entities/channel.entity';
import {
  ChatMessageReceiveEvent,
  MessageFormatterService,
} from '@steglasaurous/chat';

describe('Bot command listener', () => {
  const mockBotCommand = {
    matchesTrigger: jest.fn(),
    execute: jest.fn(),
    shouldAlwaysTrigger: jest.fn(),
  };

  const mockChannelRepository = {
    findOneBy: jest.fn(),
  };
  const mockBotCommandsExecutedTotal = {
    inc: jest.fn(),
  };

  let service: BotCommandListener;
  let channel: Channel;
  let chatEvent: ChatMessageReceiveEvent;
  let messageFormatterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BotCommandListener],
    })
      .useMocker((token) => {
        switch (token) {
          case 'BOT_COMMANDS':
            return [mockBotCommand];
          case 'BOT_CHANNEL_NAME':
            return 'BOT_CHANNEL_NAME';
          case 'ChannelRepository':
            return mockChannelRepository;
          case getToken(Metrics.BotCommandsExecutedTotal):
            return mockBotCommandsExecutedTotal;
        }
        return getGenericNestMock(token);
      })
      .compile();

    service = module.get(BotCommandListener);
    channel = getMockChannel();
    chatEvent = new ChatMessageReceiveEvent(getMockChatMessage());

    messageFormatterService = module.get(MessageFormatterService);
    messageFormatterService.formatMessage.mockImplementation(
      (message: string) => {
        return '! ' + message;
      }
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should execute the bot command matching the trigger and emit the response to the chat client channel', async () => {
    mockBotCommand.matchesTrigger.mockReturnValue(true);
    mockChannelRepository.findOneBy.mockReturnValue(channel);
    mockBotCommand.execute.mockReturnValue('sampleResponse');
    mockBotCommand.shouldAlwaysTrigger.mockReturnValue(false);

    await service.handle(chatEvent);

    expect(mockBotCommand.matchesTrigger).toHaveBeenCalledWith(
      chatEvent.chatMessage
    );
    expect(mockChannelRepository.findOneBy).toHaveBeenCalledWith({
      channelName: chatEvent.chatMessage.channelName,
    });
    expect(mockBotCommand.execute).toHaveBeenCalledWith(
      channel,
      chatEvent.chatMessage
    );
    expect(chatEvent.chatMessage.client.sendMessage).toHaveBeenCalledWith(
      channel.channelName,
      '! sampleResponse'
    );
  });

  it('should do nothing if no bot command triggers match', async () => {
    mockBotCommand.matchesTrigger.mockReturnValue(false);

    await service.handle(chatEvent);

    expect(mockChannelRepository.findOneBy).not.toHaveBeenCalled();
  });

  xit('should run the command in the context of the bot channel if the channel was not in the database', async () => {
    mockBotCommand.matchesTrigger.mockReturnValue(true);
    mockChannelRepository.findOneBy.mockReturnValue(undefined);
    mockBotCommand.execute.mockReturnValue('sampleResponse');
    mockBotCommand.shouldAlwaysTrigger.mockReturnValue(false);
    chatEvent.chatMessage.channelName = 'BOT_CHANNEL_NAME';

    await service.handle(chatEvent);
    // FIXME: CONTINUE HERE
  });
  // xit('should do nothing if the channel was not found in the database, and was not from the bot channel', async () => {});
  // xit('should do nothing if the bot is disabled and the command should not always trigger', async () => {});
  // xit('should execute the command if shouldAlwaysTrigger is true, even if the channel is disabled', async () => {});
  // xit('should not emit a response if the command did not return one', async () => {});
});
