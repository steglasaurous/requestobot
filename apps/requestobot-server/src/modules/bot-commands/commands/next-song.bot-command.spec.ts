import { Test, TestingModule } from '@nestjs/testing';
import {
  getGenericNestMock,
  getMockChannel,
  getMockChatMessage,
} from '../../../../test/helpers';
import { ChatMessage } from '@steglasaurous/chat';
import { Channel } from '../../data-store/entities/channel.entity';
import { I18nService } from 'nestjs-i18n';
import { NextSongBotCommand } from './next-song.bot-command';
import { SongRequestService } from '../../song-request/services/song-request.service';
import { Song } from '../../data-store/entities/song.entity';
import { SongRequest } from '../../data-store/entities/song-request.entity';

describe('Next song bot command', () => {
  const channelRepositoryMock = {
    save: jest.fn(),
    findOneBy: jest.fn(),
  };
  let service: NextSongBotCommand;
  let songRequestService;
  let i18n;

  let channel;
  let chatMessage;
  let song;
  let songRequest;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NextSongBotCommand],
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

    service = module.get(NextSongBotCommand);
    i18n = module.get(I18nService);
    songRequestService = module.get(SongRequestService);

    channel = getMockChannel();

    chatMessage = getMockChatMessage();
    chatMessage.userIsBroadcaster = true;

    song = new Song();
    song.title = 'songTitle';
    song.artist = 'songArtist';
    song.mapper = 'songMapper';

    songRequest = new SongRequest();
    songRequest.requesterName = 'someUser';
    songRequest.song = song;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return a description of the command', () => {
    expect(service.getDescription().length).toBeGreaterThan(1);
  });

  it('should show the next requested song', async () => {
    songRequestService.getNextRequest.mockReturnValue(
      Promise.resolve(songRequest)
    );

    const response = await service.execute(channel, chatMessage);
    expect(response).toEqual('chat.NextRequest');
    expect(i18n.t).toHaveBeenCalledWith('chat.NextRequest', {
      lang: channel.lang,
      args: {
        title: songRequest.song.title,
        artist: songRequest.song.artist,
        mapper: songRequest.song.mapper,
        requesterName: songRequest.requesterName,
      },
    });
  });
  it('should not respond if the user is not a broadcaster or moderator', async () => {
    chatMessage.userIsMod = false;
    chatMessage.userIsBroadcaster = false;
    const response = await service.execute(channel, chatMessage);
    expect(response).toBeUndefined();
  });

  it('should return queue empty message if the queue is empty', async () => {
    songRequestService.getNextRequest.mockReturnValue(
      Promise.resolve(undefined)
    );

    const response = await service.execute(channel, chatMessage);
    expect(response).toEqual('chat.QueueEmpty');
    expect(i18n.t).toHaveBeenCalledWith('chat.QueueEmpty', {
      lang: channel.lang,
    });
  });
});
