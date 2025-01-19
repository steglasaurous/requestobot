import { Test, TestingModule } from '@nestjs/testing';
import {
  getGenericNestMock,
  getMockChannel,
  getMockChatMessage,
  getSampleSongRequests,
} from '../../../../test/helpers';
import { I18nService } from 'nestjs-i18n';
import { RemoveBotCommand } from './remove.bot-command';
import { SongRequestService } from '../../song-request/services/song-request.service';

describe('Remove command', () => {
  let service: RemoveBotCommand;
  let mockSongRequestService;
  let i18n;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RemoveBotCommand],
    })
      .useMocker((token) => {
        return getGenericNestMock(token);
      })
      .compile();

    service = module.get(RemoveBotCommand);
    i18n = module.get(I18nService);
    mockSongRequestService = module.get(SongRequestService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return a description of the command', () => {
    expect(service.getDescription().length).toBeGreaterThan(1);
  });

  it('should remove the song request from the queue', async () => {
    const chatMessage = getMockChatMessage();
    chatMessage.userIsBroadcaster = true;
    chatMessage.message = '!remove #2';
    const songRequests = getSampleSongRequests(2);
    mockSongRequestService.getAllRequests.mockReturnValue(
      Promise.resolve(songRequests),
    );

    const response = await service.execute(getMockChannel(), chatMessage);
    expect(response).toEqual('chat.SongRequestRemoved');
    expect(mockSongRequestService.removeRequest).toHaveBeenCalledWith(
      songRequests[1],
    );
    expect(i18n.t).toHaveBeenCalledWith('chat.SongRequestRemoved', {
      lang: getMockChannel().lang,
      args: {
        title: songRequests[1].song.title,
        artist: songRequests[1].song.artist,
        mapper: songRequests[1].song.mapper,
        requesterName: songRequests[1].requesterName,
      },
    });
  });
  it('should return an error if not song request position was provided', async () => {
    const chatMessage = getMockChatMessage();
    chatMessage.message = '!remove';

    const response = await service.execute(getMockChannel(), chatMessage);
    expect(response).toEqual('chat.InvalidSongRequestNumber');
    expect(i18n.t).toHaveBeenCalledWith('chat.InvalidSongRequestNumber', {
      lang: getMockChannel().lang,
    });
  });
  it('should return an error if an invalid song request position is provided', async () => {
    const chatMessage = getMockChatMessage();

    const invalidPositionValues = ['#0', '#-1', 'fnie', '$&#!()'];

    for (const invalidPositionValue of invalidPositionValues) {
      chatMessage.message = `!remove ${invalidPositionValue}`;
      const response = await service.execute(getMockChannel(), chatMessage);
      expect(response).toEqual('chat.InvalidSongRequestNumber');
      expect(i18n.t).toHaveBeenCalledWith('chat.InvalidSongRequestNumber', {
        lang: getMockChannel().lang,
      });
    }
  });

  it('should return an error if providing a song request position greater than the length of the queue', async () => {
    const chatMessage = getMockChatMessage();
    chatMessage.message = '!remove #3';

    mockSongRequestService.getAllRequests.mockReturnValue(
      Promise.resolve(getSampleSongRequests(2)),
    );
    const response = await service.execute(getMockChannel(), chatMessage);
    expect(response).toEqual('chat.InvalidSongRequestNumber');
    expect(i18n.t).toHaveBeenCalledWith('chat.InvalidSongRequestNumber', {
      lang: getMockChannel().lang,
    });
  });
  it('should reject the removal request if the user is not a broadcaster, mod or the original requester of the song', async () => {
    const chatMessage = getMockChatMessage();
    chatMessage.message = '!remove #1';
    chatMessage.userIsBroadcaster = false;
    chatMessage.userIsMod = false;
    chatMessage.username = 'SomeOtherGuy';

    mockSongRequestService.getAllRequests.mockReturnValue(
      Promise.resolve(getSampleSongRequests(2)),
    );
    const response = await service.execute(getMockChannel(), chatMessage);
    expect(response).toEqual('chat.OnlyRemoveOwnSongs');
    expect(i18n.t).toHaveBeenCalledWith('chat.OnlyRemoveOwnSongs', {
      lang: getMockChannel().lang,
    });
  });
});
