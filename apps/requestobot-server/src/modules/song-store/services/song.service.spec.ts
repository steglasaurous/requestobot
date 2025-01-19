import { Test, TestingModule } from '@nestjs/testing';
import { SongService } from './song.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Song } from '../../data-store/entities/song.entity';
import { SONG_SEARCH_STRATEGIES } from '../injection-tokens';
import { getGenericNestMock, getSampleSong } from '../../../../test/helpers';
import { Game } from '../../data-store/entities/game.entity';
import { BotStateService } from '../../data-store/services/bot-state.service';

describe('SongServiceService', () => {
  let service: SongService;
  const songSearchStrategyMock = {
    supportsGame: jest.fn(),
    search: jest.fn(),
  };
  const userBotStateMock = {
    getState: jest.fn(),
    setState: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongService,
        {
          provide: getRepositoryToken(Song),
          useValue: {
            findOneBy: jest.fn(),
          },
        },
        {
          provide: SONG_SEARCH_STRATEGIES,
          useValue: [songSearchStrategyMock],
        },
      ],
    })
      .useMocker((token) => {
        switch (token) {
          case getRepositoryToken(Song):
            return { findOneBy: jest.fn() };
          case SONG_SEARCH_STRATEGIES:
            return [songSearchStrategyMock];
          case BotStateService:
            return userBotStateMock;
        }

        return getGenericNestMock(token);
      })
      .compile();

    service = module.get<SongService>(SongService);
  });

  // afterEach(() => {
  //   jest.resetAllMocks();
  // });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // *** SONG SEARCH ***
  it('should return one song search result', async () => {
    const query = 'some song';
    const game = new Game();
    const username = 'someuser';
    const channelName = 'somechannel';
    const song = getSampleSong(1);
    songSearchStrategyMock.supportsGame.mockReturnValue(true);
    songSearchStrategyMock.search.mockReturnValue([song]);

    const result = await service.searchSongs(
      query,
      game,
      username,
      channelName,
    );
    expect(result).toEqual([song]);
    expect(userBotStateMock.setState).not.toHaveBeenCalled();
  });

  it('should return multiple search results and save it to bot state', async () => {
    const query = 'some song';
    const game = new Game();
    const username = 'someuser';
    const channelName = 'somechannel';
    const song = getSampleSong(1);
    const song2 = getSampleSong(2);
    songSearchStrategyMock.supportsGame.mockReturnValue(true);
    songSearchStrategyMock.search.mockReturnValue([song, song2]);

    const result = await service.searchSongs(
      query,
      game,
      username,
      channelName,
    );
    expect(result).toEqual([song, song2]);
    expect(userBotStateMock.setState).toHaveBeenCalledWith(
      username,
      channelName,
      {
        lastQueryResults: [song, song2],
      },
    );
  });

  // *** GET SONG SELECTION OUTPUT ***

  // it('should show x more songs if there are more than 5 songs in the results', async () => {
  //   const songResults = [];
  //   let expectedResponse = 'chat.SelectSong';
  //
  //   for (let i = 1; i <= 6; i++) {
  //     songResults.push(getSampleSong(i));
  //     if (i < 6) {
  //       expectedResponse += `#${i} title_${i} - artist_${i} (mapper_${i}) `;
  //     }
  //   }
  //   expectedResponse += 'chat.AndMore';
  //
  //   songService.searchSongs.mockReturnValue(songResults);
  //   const response = await service.execute(channel, chatMessage);
  //   expect(response).toEqual(expectedResponse);
  //   expect(i18n.t).toHaveBeenCalledWith('chat.SelectSong', { lang: 'en' });
  //   expect(i18n.t).toHaveBeenCalledWith('chat.AndMore', {
  //     lang: 'en',
  //     args: { songsRemaining: 1 },
  //   });
  // });

  // it('should add a song from a previous search by # to the request queue', async () => {
  //   const songResults = [getSampleSong(1), getSampleSong(2)];
  //   const botState: UserBotState = {
  //     id: 1,
  //     requesterName: 'someuser',
  //     channel: channel,
  //     state: { lastQueryResults: songResults },
  //     timestamp: new Date(),
  //   };
  //
  //   botStateService.getState.mockReturnValue(botState);
  //   songRequestService.addRequest.mockReturnValue({
  //     success: true,
  //   });
  //
  //   chatMessage.message = '!req #1';
  //
  //   const response = await service.execute(channel, chatMessage);
  //   expect(response).toEqual('chat.SongAddedToQueue');
  //   expect(i18n.t).toHaveBeenCalledWith('chat.SongAddedToQueue', {
  //     lang: 'en',
  //     args: {
  //       title: songResults[0].title,
  //       artist: songResults[0].artist,
  //       mapper: songResults[0].mapper,
  //     },
  //   });
  // });

  // it('should return no songs found if an incorrect # is requested from a previous search', async () => {
  //   const songResults = [getSampleSong(1), getSampleSong(2)];
  //   const botState: UserBotState = {
  //     id: 1,
  //     requesterName: 'someuser',
  //     channel: channel,
  //     state: { lastQueryResults: songResults },
  //     timestamp: new Date(),
  //   };
  //
  //   botStateService.getState.mockReturnValue(botState);
  //   songRequestService.addRequest.mockReturnValue({
  //     success: true,
  //   });
  //
  //   chatMessage.message = '!req #8';
  //
  //   const response = await service.execute(channel, chatMessage);
  //   expect(response).toEqual('chat.NoSongsFound');
  //   expect(i18n.t).toHaveBeenCalledWith('chat.NoSongsFound', {
  //     lang: 'en',
  //   });
  // });
});
