import { Test, TestingModule } from '@nestjs/testing';
import {
  getGenericNestMock,
  getMockChannel,
  getSampleSongRequests,
} from '../../../../../test/helpers';
import { OnePerUserQueueStrategy } from './one-per-user.queue-strategy';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SongRequest } from '../../../data-store/entities/song-request.entity';
import { Repository } from 'typeorm';

describe('One-Per-User QueueStrategy', () => {
  let service: OnePerUserQueueStrategy;
  let mockSongRequestRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OnePerUserQueueStrategy],
    })
      .useMocker((token) => {
        switch (token) {
          case getRepositoryToken(SongRequest):
            return {
              countBy: jest.fn(),
              maximum: jest.fn(),
              findOne: jest.fn(),
            };
        }

        return getGenericNestMock(token);
      })
      .compile();

    service = module.get<OnePerUserQueueStrategy>(OnePerUserQueueStrategy);
    mockSongRequestRepository = module.get<Repository<SongRequest>>(
      getRepositoryToken(SongRequest),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should set order to 1 and priority to 0 if the queue is empty', async () => {
    const channel = getMockChannel();
    const songRequest = getSampleSongRequests(1)[0];

    const resultingSongRequest = await service.setNextOrder(
      channel,
      songRequest,
    );
    expect(resultingSongRequest.requestOrder).toEqual(1);
    expect(resultingSongRequest.requestPriority).toEqual(0);
  });

  it('should add the user to the end of the queue if they already have a request', async () => {
    // Mocking the dataset like:
    // User A | requestOrder 1 | requestPriority 0
    // User B | requestOrder 2 | requestPriority 0

    const channel = getMockChannel();
    const songRequest = getSampleSongRequests(1)[0];

    mockSongRequestRepository.countBy.mockReturnValue(1);
    mockSongRequestRepository.maximum.mockReturnValueOnce(2);

    const resultingSongRequest = await service.setNextOrder(
      channel,
      songRequest,
    );

    expect(resultingSongRequest.requestPriority).toEqual(1);
    expect(resultingSongRequest.requestOrder).toEqual(3);
  });

  it('should add the request to the end of the next priority group if they already have a song in the queue', async () => {
    // Mocking the dataset like:
    // User A | requestOrder 1 | requestPriority 0
    // User B | requestOrder 2 | requestPriority 0
    // User B | requestOrder 3 | requestPriority 1
    // User B | requestOrder 4 | requestPriority 2

    // Result should look like:

    // User A | requestOrder 1 | requestPriority 0
    // User B | requestOrder 2 | requestPriority 0
    // User B | requestOrder 3 | requestPriority 1
    // User A | requestOrder 3.5 | requestPriority 1
    // User B | requestOrder 4 | requestPriority 2

    // Adding another User A request.
    const channel = getMockChannel();
    const songRequest = getSampleSongRequests(1)[0];

    mockSongRequestRepository.countBy.mockReturnValue(1);
    mockSongRequestRepository.maximum.mockReturnValueOnce(3);

    const nextOrderSongRequest = getSampleSongRequests(1)[0];
    nextOrderSongRequest.requestPriority = 2;
    nextOrderSongRequest.requestOrder = 4;

    mockSongRequestRepository.findOne.mockReturnValue(nextOrderSongRequest);
    const resultingSongRequest = await service.setNextOrder(
      channel,
      songRequest,
    );

    expect(resultingSongRequest.requestPriority).toEqual(1);
    expect(resultingSongRequest.requestOrder).toEqual(3.5);
  });

  it('should add the request to the end of the next priority group if they already have a song in the queue 2', async () => {
    // Mocking the dataset like:
    // User A | requestOrder 1 | requestPriority 0
    // User B | requestOrder 2 | requestPriority 0
    // User B | requestOrder 3 | requestPriority 1
    // User A | requestOrder 3.5 | requestPriority 1
    // User B | requestOrder 4 | requestPriority 2

    // REsult should look like:

    // User A | requestOrder 1 | requestPriority 0
    // User B | requestOrder 2 | requestPriority 0
    // User B | requestOrder 3 | requestPriority 1
    // User A | requestOrder 3.5 | requestPriority 1
    // User B | requestOrder 4 | requestPriority 2
    // User A | requestOrder 5 | requestPriority 2

    // Adding another User A request.
    const channel = getMockChannel();
    const songRequest = getSampleSongRequests(1)[0];

    mockSongRequestRepository.countBy.mockReturnValue(2);
    mockSongRequestRepository.maximum.mockReturnValueOnce(4);

    mockSongRequestRepository.findOne.mockReturnValue(undefined);

    const resultingSongRequest = await service.setNextOrder(
      channel,
      songRequest,
    );

    expect(resultingSongRequest.requestPriority).toEqual(2);
    expect(resultingSongRequest.requestOrder).toEqual(5);
  });
});
