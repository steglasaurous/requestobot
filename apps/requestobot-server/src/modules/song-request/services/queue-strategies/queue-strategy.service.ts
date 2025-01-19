import { Inject, Injectable } from '@nestjs/common';
import { QueueStrategy } from './queue-strategy.interface';
import { SongRequest } from '../../../data-store/entities/song-request.entity';
import { Channel } from '../../../data-store/entities/channel.entity';
import { QUEUE_STRATEGIES } from '../../utils/di-tokens';

@Injectable()
export class QueueStrategyService {
  private defaultQueueStrategyName = 'fifo';
  constructor(
    @Inject(QUEUE_STRATEGIES) private queueStrategies: QueueStrategy[],
  ) {}

  async getNextOrder(
    channel: Channel,
    songRequest: SongRequest,
    queueStrategyName: string,
  ): Promise<SongRequest> {
    let queueStrategy: QueueStrategy =
      this.getQueueStrategyForName(queueStrategyName);

    if (!queueStrategy) {
      queueStrategy = this.getQueueStrategyForName(
        this.defaultQueueStrategyName,
      );
    }

    return await queueStrategy.setNextOrder(channel, songRequest);
  }

  private getQueueStrategyForName(
    queueStrategyName: string,
  ): QueueStrategy | undefined {
    for (const queueStrategy of this.queueStrategies) {
      if (queueStrategy.getStrategyName() == queueStrategyName) {
        return queueStrategy;
      }
    }
  }
}
