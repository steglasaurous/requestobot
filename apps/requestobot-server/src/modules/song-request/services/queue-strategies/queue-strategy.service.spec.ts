import { Test, TestingModule } from '@nestjs/testing';
import { QueueStrategyService } from './queue-strategy.service';
import { getGenericNestMock } from '../../../../../test/helpers';
import { QUEUE_STRATEGIES } from '../../utils/di-tokens';

describe('QueueStrategyService', () => {
  let service: QueueStrategyService;
  const mockQueueStrategy = {
    getNextOrder: jest.fn(),
    getStrategyName: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QueueStrategyService],
    })
      .useMocker((token) => {
        switch (token) {
          case QUEUE_STRATEGIES:
            return [mockQueueStrategy];
        }
        return getGenericNestMock(token);
      })
      .compile();

    service = module.get<QueueStrategyService>(QueueStrategyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
