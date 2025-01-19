import { Test, TestingModule } from '@nestjs/testing';
import {
  getGenericNestMock,
  getMockChannel,
  getMockChatMessage,
  getSampleSongRequests,
} from '../../../../test/helpers';
import { I18nService } from 'nestjs-i18n';
import { QueueBotCommand } from './queue.bot-command';
import { SongRequestService } from '../../song-request/services/song-request.service';

describe('Open bot command', () => {
  let service: QueueBotCommand;
  let i18n;
  let songRequestService;

  let channel;
  let chatMessage;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QueueBotCommand],
    })
      .useMocker((token) => {
        return getGenericNestMock(token);
      })
      .compile();

    service = module.get(QueueBotCommand);
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

  it('should return a list of songs in the queue', async () => {
    const songRequests = getSampleSongRequests(1);
    songRequestService.getAllRequests.mockReturnValue(songRequests);

    const response = await service.execute(channel, chatMessage);

    expect(response.trim()).toEqual('#1 title_1 - artist_1 (mapper_1)');
  });

  it('should show up to 5 names with a count of how many additional songs are queued', async () => {
    const songRequests = getSampleSongRequests(6);
    songRequestService.getAllRequests.mockReturnValue(songRequests);

    const response = await service.execute(channel, chatMessage);

    expect(response.trim()).toEqual(
      '#1 title_1 - artist_1 (mapper_1) #2 title_2 - artist_2 (mapper_2) #3 title_3 - artist_3 (mapper_3) #4 title_4 - artist_4 (mapper_4) #5 title_5 - artist_5 (mapper_5) chat.AndMore'
    );

    expect(i18n.t).toHaveBeenCalled();
    expect(i18n.t.mock.calls[0][1]).toEqual({
      lang: 'en',
      args: { songsRemaining: 1 },
    });
  });

  it('should indicate the queue is empty', async () => {
    songRequestService.getAllRequests.mockReturnValue([]);

    const response = await service.execute(channel, chatMessage);
    expect(response).toEqual('chat.QueueEmpty');
  });
});
