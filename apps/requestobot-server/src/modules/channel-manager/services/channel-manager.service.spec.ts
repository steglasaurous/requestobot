import { Test, TestingModule } from '@nestjs/testing';
import { ChannelManagerService } from './channel-manager.service';
import { getGenericNestMock } from '../../../../test/helpers';
import { getToken } from '@willsoto/nestjs-prometheus';
import { Metrics } from '../../bot-commands/models/metrics.enum';

describe('ChannelManagerService', () => {
  let service: ChannelManagerService;
  const channelRepositoryMock = {
    save: jest.fn(),
    findOneBy: jest.fn(),
  };
  const gameRepositoryMock = {
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChannelManagerService],
    })
      .useMocker((token) => {
        if (token.toString().startsWith('PROM_METRIC')) {
          return {
            inc: jest.fn(),
            dec: jest.fn(),
          };
        }

        switch (token) {
          case 'ChannelRepository':
            return channelRepositoryMock;
          case 'GameRepository':
            return gameRepositoryMock;

          default:
            return getGenericNestMock(token);
        }
      })
      .compile();

    service = module.get<ChannelManagerService>(ChannelManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
