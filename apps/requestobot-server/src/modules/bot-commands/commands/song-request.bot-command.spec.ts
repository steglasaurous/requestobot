import { Test, TestingModule } from '@nestjs/testing';
import { SongRequestBotCommand } from './song-request.bot-command';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Channel } from '../../data-store/entities/channel.entity';
import {
  getGenericNestMock,
  getMockChannel,
  getMockChatMessage,
  getSampleSong,
} from '../../../../test/helpers';
import { I18nService } from 'nestjs-i18n';
import { SongRequestService } from '../../song-request/services/song-request.service';
import { SongService } from '../../song-store/services/song.service';
import { SongRequestErrorType } from '../../song-request/models/song-request-error-type.enum';

describe('SongRequestBotCommand', () => {
  let service: SongRequestBotCommand;
  let i18n;
  let songRequestService;
  let songService;
  let channel;
  let chatMessage;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongRequestBotCommand,
        {
          provide: getRepositoryToken(Channel),
          useValue: {
            findOneBy: jest.fn(),
          },
        },
      ],
    })
      .useMocker((token) => {
        return getGenericNestMock(token);
      })
      .compile();

    service = module.get<SongRequestBotCommand>(SongRequestBotCommand);
    i18n = module.get(I18nService);
    i18n.t.mockImplementation((key: string) => {
      return key;
    });

    songRequestService = module.get(SongRequestService);
    songService = module.get(SongService);

    channel = getMockChannel();
    chatMessage = getMockChatMessage();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a description', () => {
    expect(service.getDescription()).toBeDefined();
  });

  it('should display a help message relevant to the current game if no search terms are present', async () => {
    chatMessage.message = '!req';

    const response = await service.execute(channel, chatMessage);

    expect(response).toEqual('chat.RequestHelp_spin');
    expect(i18n.t).toHaveBeenCalledWith('chat.RequestHelp_spin', {
      lang: 'en',
    });

    return Promise.resolve();
  });

  it('should return a message if the queue is closed', async () => {
    channel.queueOpen = false;
    chatMessage.message = '!req test';

    const response = await service.execute(channel, chatMessage);
    expect(response).toEqual('chat.SorryQueueIsClosed');
    expect(i18n.t).toHaveBeenCalledWith('chat.SorryQueueIsClosed', {
      lang: 'en',
    });

    return Promise.resolve();
  });

  it('should send an error message when search throws an error', async () => {
    chatMessage.message = '!req test';
    songService.searchSongs.mockImplementation(() => {
      throw new Error('search failed');
    });

    const response = await service.execute(channel, chatMessage);
    expect(response).toEqual('chat.SearchErrorTryAgain');
    expect(i18n.t).toHaveBeenCalledWith('chat.SearchErrorTryAgain', {
      lang: 'en',
    });

    return Promise.resolve();
  });

  it('should return no songs found if search returned with no results', async () => {
    songService.searchSongs.mockReturnValue([]);
    const response = await service.execute(channel, chatMessage);

    expect(response).toEqual('chat.NoSongsFound');
    expect(i18n.t).toHaveBeenCalledWith('chat.NoSongsFound', { lang: 'en' });
  });

  it('should add song to the queue if only one result is found', async () => {
    const sampleSong = getSampleSong(1);
    songService.searchSongs.mockReturnValue([sampleSong]);
    songRequestService.addRequest.mockReturnValue({
      success: true,
    });

    const response = await service.execute(channel, chatMessage);
    expect(response).toEqual('chat.SongAddedToQueue');
    expect(i18n.t).toHaveBeenCalledWith('chat.SongAddedToQueue', {
      lang: 'en',
      args: {
        title: sampleSong.title,
        artist: sampleSong.artist,
        mapper: sampleSong.mapper,
      },
    });
  });
  it('should send a message with multiple results, storing the results for later selection', async () => {
    const songResults = [getSampleSong(1), getSampleSong(2)];
    songService.searchSongs.mockReturnValue(songResults);
    songService.getSongSelectionOutput.mockReturnValue('chat.SelectSong');

    const expectedOutput = 'chat.SelectSong';
    const response = await service.execute(channel, chatMessage);
    expect(response).toEqual(expectedOutput);
    expect(songService.getSongSelectionOutput).toHaveBeenCalledWith(
      'en',
      songResults
    );
  });

  // FIXME: Move these tests into tests for songService, as that functionality now exists there.

  it('should send a message that the song is already in the queue', async () => {
    const song = getSampleSong(1);
    songService.searchSongs.mockReturnValue([song]);
    songRequestService.addRequest.mockReturnValue({
      success: false,
      errorType: SongRequestErrorType.ALREADY_IN_QUEUE,
    });

    const response = await service.execute(channel, chatMessage);
    expect(response).toEqual('chat.SongAlreadyInQueue');
    expect(i18n.t).toHaveBeenCalledWith('chat.SongAlreadyInQueue', {
      lang: 'en',
    });
  });

  it('should respond that the song has already been played', async () => {
    const song = getSampleSong(1);
    songService.searchSongs.mockReturnValue([song]);
    songRequestService.addRequest.mockReturnValue({
      success: false,
      errorType: SongRequestErrorType.ALREADY_PLAYED,
    });

    const response = await service.execute(channel, chatMessage);
    expect(response).toEqual('chat.SongAlreadyPlayed');
    expect(i18n.t).toHaveBeenCalledWith('chat.SongAlreadyPlayed', {
      lang: 'en',
    });
  });

  it('should report an error if adding a song request failed for an uncaught reason', async () => {
    const song = getSampleSong(1);
    songService.searchSongs.mockReturnValue([song]);
    songRequestService.addRequest.mockReturnValue({
      success: false,
      errorType: SongRequestErrorType.SERVER_ERROR,
    });

    const response = await service.execute(channel, chatMessage);
    expect(response).toEqual('chat.SongRequestFailed');
    expect(i18n.t).toHaveBeenCalledWith('chat.SongRequestFailed', {
      lang: 'en',
    });
  });

  it('should respond that a song is banned if requested', async () => {
    const song = getSampleSong(1);
    songService.searchSongs.mockReturnValue([song]);
    songRequestService.addRequest.mockReturnValue({
      success: false,
      errorType: SongRequestErrorType.SONG_IS_BANNED,
    });

    const response = await service.execute(channel, chatMessage);
    expect(response).toEqual('chat.SongIsBanned');
    expect(i18n.t).toHaveBeenCalledWith('chat.SongIsBanned', {
      lang: 'en',
    });
  });
});
