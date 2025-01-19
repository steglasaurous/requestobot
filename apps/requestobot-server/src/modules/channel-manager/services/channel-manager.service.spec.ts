import { Test, TestingModule } from '@nestjs/testing';
import { ChannelManagerService } from './channel-manager.service';

describe('ChannelManagerService', () => {
  let service: ChannelManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChannelManagerService],
    }).compile();

    service = module.get<ChannelManagerService>(ChannelManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
