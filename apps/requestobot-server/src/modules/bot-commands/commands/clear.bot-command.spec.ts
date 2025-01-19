import { Test, TestingModule } from '@nestjs/testing';
import {
  getGenericNestMock,
  getMockChannel,
  getMockChatMessage,
} from '../../../../test/helpers';
import { ClearBotCommand } from './clear.bot-command';
import { SongRequestService } from '../../song-request/services/song-request.service';
import { I18nService } from 'nestjs-i18n';

describe('Clear bot command', () => {
  let service: ClearBotCommand;
  let songRequestServiceMock;
  let i18nMock;

  let channel;
  let chatMessage;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClearBotCommand],
    })
      .useMocker((token) => {
        return getGenericNestMock(token);
      })
      .compile();

    service = module.get(ClearBotCommand);
    songRequestServiceMock = module.get(SongRequestService);
    i18nMock = module.get(I18nService);
    channel = getMockChannel();
    chatMessage = getMockChatMessage();
  });

  it('should return a description of the command', () => {
    expect(service.getDescription().length).toBeGreaterThan(1);
  });

  it('should clear the queue if user is a broadcaster', async () => {
    chatMessage.userIsBroadcaster = true;

    const response = await service.execute(channel, chatMessage);
    expect(response).toEqual('chat.QueueCleared');
    expect(i18nMock.t).toHaveBeenCalledWith('chat.QueueCleared', {
      lang: 'en',
    });
    expect(songRequestServiceMock.clearAllRequests).toHaveBeenCalledWith(
      channel
    );
  });

  it('should clear the queue if user is a moderator', async () => {
    chatMessage.userIsBroadcaster = false;
    chatMessage.userIsMod = true;

    const response = await service.execute(channel, chatMessage);
    expect(response).toEqual('chat.QueueCleared');
    expect(i18nMock.t).toHaveBeenCalledWith('chat.QueueCleared', {
      lang: 'en',
    });
    expect(songRequestServiceMock.clearAllRequests).toHaveBeenCalledWith(
      channel
    );
  });

  it('should not respond if the user is not a broadcaster or a moderator', async () => {
    chatMessage.userIsBroadcaster = false;
    chatMessage.userIdMod = false;

    const response = await service.execute(channel, chatMessage);
    expect(response).not.toBeDefined();
    expect(i18nMock.t).not.toHaveBeenCalled();
    expect(songRequestServiceMock.clearAllRequests).not.toHaveBeenCalled();
  });
});
