import { Test, TestingModule } from '@nestjs/testing';
import {
  getGenericNestMock,
  getMockChannel,
  getMockChatMessage,
  getSampleSong,
} from '../../../../test/helpers';
import { Channel } from '../../data-store/entities/channel.entity';
import { ChatMessage } from '@steglasaurous/chat';
import { I18nService } from 'nestjs-i18n';
import { BanSongBotCommand } from './ban-song.bot-command';
import { SongService } from '../../song-store/services/song.service';

describe('Ban song bot command', () => {
  let service: BanSongBotCommand;
  let songServiceMock;
  let i18nMock;
  const songBanRepositoryMock = {
    save: jest.fn(),
  };

  let channel: Channel;
  let chatMessage: ChatMessage;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BanSongBotCommand],
    })
      .useMocker((token) => {
        if (token == 'SongBanRepository') {
          return songBanRepositoryMock;
        }

        return getGenericNestMock(token);
      })
      .compile();

    service = module.get(BanSongBotCommand);
    songServiceMock = module.get(SongService);
    i18nMock = module.get(I18nService);
    channel = getMockChannel();
    chatMessage = getMockChatMessage();
  });

  it('should return a description of the command', () => {
    expect(service.getDescription().length).toBeGreaterThan(1);
  });

  it('should add a song to the ban list for a channel', async () => {
    chatMessage.userIsBroadcaster = true;
    chatMessage.message = '!addsongban a very bad song';
    const song = getSampleSong();
    songServiceMock.searchSongs.mockReturnValue([song]);

    const response = await service.execute(channel, chatMessage);
    expect(response).toEqual('chat.SongAddedToBanList');
    expect(i18nMock.t).toHaveBeenCalledWith('chat.SongAddedToBanList', {
      lang: 'en',
      args: {
        title: song.title,
        artist: song.artist,
        mapper: song.mapper,
      },
    });
  });

  it('should only allow broadcasters or mods to add songs to the ban list', async () => {
    chatMessage.userIsBroadcaster = false;
    chatMessage.message = '!addsongban a very bad song';

    const response = await service.execute(channel, chatMessage);
    expect(response).toBeUndefined();
  });
  it('should send a message with multiple results, storing the results for later selection', async () => {
    chatMessage.userIsBroadcaster = true;

    const songResults = [getSampleSong(1), getSampleSong(2)];
    songServiceMock.searchSongs.mockReturnValue(songResults);
    songServiceMock.getSongSelectionOutput.mockReturnValue('chat.SelectSong');

    const expectedOutput = 'chat.SelectSong';
    const response = await service.execute(channel, chatMessage);
    expect(response).toEqual(expectedOutput);
    expect(songServiceMock.getSongSelectionOutput).toHaveBeenCalledWith(
      'en',
      songResults
    );
  });

  it('should return no songs found if search returned with no results', async () => {
    chatMessage.userIsBroadcaster = true;

    songServiceMock.searchSongs.mockReturnValue([]);
    const response = await service.execute(channel, chatMessage);

    expect(response).toEqual('chat.NoSongsFound');
    expect(i18nMock.t).toHaveBeenCalledWith('chat.NoSongsFound', {
      lang: 'en',
    });
  });

  it('should indicate song is already in ban list', async () => {
    chatMessage.userIsBroadcaster = true;

    chatMessage.message = '!addsongban a very bad song';
    const song = getSampleSong();
    songServiceMock.searchSongs.mockReturnValue([song]);
    songBanRepositoryMock.save.mockRejectedValue({
      code: '23505',
    });
    const response = await service.execute(channel, chatMessage);
    expect(response).toEqual('chat.SongAlreadyInBanList');
  });

  it('should report an error if adding a song to the ban list failed for an uncaught reason', async () => {
    chatMessage.userIsBroadcaster = true;

    const song = getSampleSong(1);
    songServiceMock.searchSongs.mockReturnValue([song]);
    songBanRepositoryMock.save.mockRejectedValue({
      code: '11111',
    });

    const response = await service.execute(channel, chatMessage);
    expect(response).toEqual('chat.AddToBanListError');
    expect(i18nMock.t).toHaveBeenCalledWith('chat.AddToBanListError', {
      lang: 'en',
    });
  });

  it('should report an error if search threw an exception', async () => {
    chatMessage.userIsBroadcaster = true;

    // The error can vary since at the moment, the search itself doesn't specifically return
    // a rejection - this would be a thrown error likely from TypeORM.
    songServiceMock.searchSongs.mockRejectedValue({ error: true });
    const response = await service.execute(channel, chatMessage);
    expect(response).toEqual('chat.SearchErrorTryAgain');
    expect(i18nMock.t).toHaveBeenCalledWith('chat.SearchErrorTryAgain', {
      lang: 'en',
    });
  });
});
