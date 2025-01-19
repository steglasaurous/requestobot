import { QueueStrategy } from './queue-strategy.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { SongRequest } from '../../../data-store/entities/song-request.entity';
import { Channel } from '../../../data-store/entities/channel.entity';

@Injectable()
export class OnePerUserQueueStrategy implements QueueStrategy {
  constructor(
    @InjectRepository(SongRequest)
    private songRequestRepository: Repository<SongRequest>,
  ) {}
  async setNextOrder(
    channel: Channel,
    songRequest: SongRequest,
  ): Promise<SongRequest> {
    // Determine user's "priority" based on number of songs currently in the queue.
    songRequest.requestPriority = await this.songRequestRepository.countBy({
      channel: channel,
      requesterName: songRequest.requesterName,
      isDone: false,
    });

    if (songRequest.requestPriority == undefined) {
      songRequest.requestPriority = 0;
    }

    // Now find how many songs are in this priority so we know what order to assign.
    const lastOrder = await this.songRequestRepository.maximum('requestOrder', {
      channel: channel,
      requestPriority: songRequest.requestPriority,
      isDone: false,
    });

    // Get the songOrder immediately following the maximum in this priority level so
    // we can set the correct order.
    const nextOrderResult = await this.songRequestRepository.findOne({
      where: {
        channel: channel,
        requestPriority: songRequest.requestPriority + 1,
        isDone: false,
      },
      order: { requestOrder: 'ASC' },
    });

    let nextOrder = undefined;
    if (nextOrderResult) {
      nextOrder = nextOrderResult.requestOrder;
    }

    if (!nextOrder && !lastOrder) {
      const nextOrderMax = await this.songRequestRepository.maximum(
        'requestOrder',
        {
          channel: channel,
          isDone: false,
        },
      );
      if (!nextOrderMax) {
        songRequest.requestOrder = 1;
      } else {
        songRequest.requestOrder = nextOrderMax + 1;
      }
    } else if (!nextOrder) {
      songRequest.requestOrder = lastOrder + 1;
    } else {
      songRequest.requestOrder = (lastOrder + nextOrder) / 2;
    }

    return songRequest;
  }

  getStrategyName(): string {
    return 'oneperuser';
  }
}
