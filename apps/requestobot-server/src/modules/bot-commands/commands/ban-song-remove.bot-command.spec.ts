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
import { SongService } from '../../song-store/services/song.service';
import { BanSongRemoveBotCommand } from './ban-song-remove.bot-command';
import { SongBan } from '../../data-store/entities/song-ban.entity';

describe('Ban song remove bot command', () => {
  let service: BanSongRemoveBotCommand;
  let songServiceMock;
  let i18nMock;
  const songBanRepositoryMock = {
    remove: jest.fn(),
    findOneBy: jest.fn(),
  };

  let channel: Channel;
  let chatMessage: ChatMessage;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BanSongRemoveBotCommand],
    })
      .useMocker((token) => {
        if (token == 'SongBanRepository') {
          return songBanRepositoryMock;
        }

        return getGenericNestMock(token);
      })
      .compile();

    service = module.get(BanSongRemoveBotCommand);
    songServiceMock = module.get(SongService);
    i18nMock = module.get(I18nService);
    channel = getMockChannel();
    chatMessage = getMockChatMessage();
  });

  it('should return a description of the command', () => {
    expect(service.getDescription().length).toBeGreaterThan(1);
  });

  it('should remove a song from the ban list for a channel', async () => {
    chatMessage.userIsBroadcaster = true;
    chatMessage.message = '!removesongban a very bad song';

    const song = getSampleSong();
    const songBan = new SongBan();
    songBan.channel = channel;
    songBan.song = song;
    songServiceMock.searchSongs.mockReturnValue([song]);
    songBanRepositoryMock.findOneBy.mockReturnValue(songBan);

    const response = await service.execute(channel, chatMessage);
    expect(response).toEqual('chat.SongRemovedFromBanList');
    expect(i18nMock.t).toHaveBeenCalledWith('chat.SongRemovedFromBanList', {
      lang: 'en',
      args: {
        title: song.title,
        artist: song.artist,
        mapper: song.mapper,
      },
    });
  });

  it('should only allow broadcasters or mods to remove songs to the ban list', async () => {
    chatMessage.userIsBroadcaster = false;
    chatMessage.message = '!removesongban a very bad song';

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

  it('should indicate song is not in the ban list', async () => {
    chatMessage.userIsBroadcaster = true;

    chatMessage.message = '!removesongban a very bad song';
    const song = getSampleSong();
    songServiceMock.searchSongs.mockReturnValue([song]);
    songBanRepositoryMock.findOneBy.mockReturnValue(undefined);

    const response = await service.execute(channel, chatMessage);
    expect(response).toEqual('chat.SongNotInBanList');
  });

  it('should report an error if adding a song to the ban list failed for an uncaught reason', async () => {
    chatMessage.userIsBroadcaster = true;

    const song = getSampleSong(1);
    songServiceMock.searchSongs.mockReturnValue([song]);

    const songBan = new SongBan();
    songBan.channel = channel;
    songBan.song = song;
    songBanRepositoryMock.findOneBy.mockReturnValue(songBan);

    songBanRepositoryMock.remove.mockRejectedValue({
      code: '11111',
    });

    const response = await service.execute(channel, chatMessage);
    expect(response).toEqual('chat.RemoveFromBanListError');
    expect(i18nMock.t).toHaveBeenCalledWith('chat.RemoveFromBanListError', {
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
