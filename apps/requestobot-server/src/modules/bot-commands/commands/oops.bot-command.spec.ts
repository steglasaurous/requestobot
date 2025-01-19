import { Test, TestingModule } from '@nestjs/testing';
import {
  getGenericNestMock,
  getMockChannel,
  getMockChatMessage,
} from '../../../../test/helpers';
import { I18nService } from 'nestjs-i18n';
import { OffBotCommand } from './off.bot-command';
import { SongRequest } from '../../data-store/entities/song-request.entity';
import { Song } from '../../data-store/entities/song.entity';
import { SongRequestService } from '../../song-request/services/song-request.service';
import { OopsBotCommand } from './oops.bot-command';

describe('Oops bot command', () => {
  const channelRepositoryMock = {
    save: jest.fn(),
    findOneBy: jest.fn(),
  };
  let service: OffBotCommand;
  let i18n;
  let songRequestService;

  let channel;
  let chatMessage;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OopsBotCommand],
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

    service = module.get(OopsBotCommand);
    i18n = module.get(I18nService);
    songRequestService = module.get(SongRequestService);

    channel = getMockChannel();
    chatMessage = getMockChatMessage();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return a description of the command', () => {
    expect(service.getDescription().length).toBeGreaterThan(1);
  });

  it('should remove most recent song request for user', async () => {
    const songRequest = new SongRequest();
    songRequest.song = new Song();
    songRequest.song.title = 'someTitle';

    songRequestService.removeMostRecentRequest.mockReturnValue(
      Promise.resolve(songRequest)
    );

    const response = await service.execute(channel, chatMessage);

    expect(response).toEqual('chat.RequestRemoved');
    expect(i18n.t).toHaveBeenCalledWith('chat.RequestRemoved', {
      lang: 'en',
      args: { title: 'someTitle' },
    });
  });

  it('should return a message indicating there is no song to remove', async () => {
    songRequestService.removeMostRecentRequest.mockReturnValue(
      Promise.resolve(undefined)
    );

    const response = await service.execute(channel, chatMessage);
    expect(response).toEqual('chat.NoUserSongRequestToRemove');
    expect(i18n.t).toHaveBeenCalledWith('chat.NoUserSongRequestToRemove', {
      lang: 'en',
    });
  });
});
