import { Injectable, Logger } from '@nestjs/common';
import { SongRequest } from '../../data-store/entities/song-request.entity';
import { FindOptionsWhere, LessThanOrEqual, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Song } from '../../data-store/entities/song.entity';
import { Channel } from '../../data-store/entities/channel.entity';
import { SongRequestResponse } from '../models/song-request-response.interface';
import { SongRequestErrorType } from '../models/song-request-error-type.enum';
import { SongService } from '../../song-store/services/song.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { QueueStrategyService } from './queue-strategies/queue-strategy.service';
import { SettingService } from '../../data-store/services/setting.service';
import { SettingName } from '../../data-store/models/setting-name.enum';
import { SongRequestQueueChangedEvent } from '../events/song-request-queue-changed.event';
import { Cron } from '@nestjs/schedule';
import { SongBan } from '../../data-store/entities/song-ban.entity';

@Injectable()
export class SongRequestService {
  private logger: Logger = new Logger(this.constructor.name);
  constructor(
    @InjectRepository(SongRequest)
    private songRequestRepository: Repository<SongRequest>,
    private songService: SongService,
    private eventEmitter: EventEmitter2,
    private queueStrategyService: QueueStrategyService,
    private settingService: SettingService,
    @InjectRepository(SongBan) private songBanRepository: Repository<SongBan>
  ) {}

  async addRequest(
    song: Song,
    channel: Channel,
    requesterName: string
  ): Promise<SongRequestResponse> {
    return new Promise<SongRequestResponse>(async (resolve) => {
      // Before we go any further, check the ban list to ensure this song isn't on it.
      const bannedSong = await this.songBanRepository.findOneBy({
        channel: channel,
        song: song,
      });
      if (bannedSong) {
        resolve({
          success: false,
          errorType: SongRequestErrorType.SONG_IS_BANNED,
        });
        return;
      }

      let savedSong: Song;
      if (!song.id) {
        // If the song hasn't been persisted to database, do that first.
        savedSong = await this.songService.saveSong(song);
      } else {
        savedSong = song;
      }

      // Search for an existing song request in the queue.
      // If it's present as a pending request, return the 'already in queue' error.
      // If it's present as a recently played request, return the 'was already played' error.
      // FUTURE: Make this configurable that if the streamer wants to allow repeats after playing a song, they can do so
      let songRequest = new SongRequest();
      songRequest.song = savedSong;
      songRequest.requesterName = requesterName;
      songRequest.requestTimestamp = new Date();
      songRequest.channel = channel;
      songRequest.isActive = false;
      songRequest.isDone = false;

      const queueStrategyName = await this.settingService.getValue(
        channel,
        SettingName.QueueStrategy
      );

      // This sets the requestOrder and requestPriority fields.
      songRequest = await this.queueStrategyService.getNextOrder(
        channel,
        songRequest,
        queueStrategyName
      );

      try {
        await this.songRequestRepository.save(songRequest);
        this.eventEmitter.emit(SongRequestQueueChangedEvent.name, {
          channel: channel,
          songRequests: await this.getAllRequests(channel),
        });

        // Apply songRequest strategy to entity
        // We do this after the save so the strategy has the opportunity to reorder other items in the queue if necessary.

        resolve({ success: true });
        return;
      } catch (error) {
        let errorType = SongRequestErrorType.SERVER_ERROR;

        if (error.code == 23505) {
          // THis is a constraint error which we're treating as a dupe entry.  Return the appropriate error.
          errorType = SongRequestErrorType.ALREADY_IN_QUEUE;

          // Find out if this is a song that's already played vs exists in the queue.
          const existingSongRequest =
            await this.songRequestRepository.findOneBy({
              channel: channel,
              song: savedSong,
            });
          if (existingSongRequest) {
            if (existingSongRequest.isDone) {
              errorType = SongRequestErrorType.ALREADY_PLAYED;
            }
          }
        } else {
          this.logger.warn('Saving song request threw error', { error: error });
        }

        resolve({
          success: false,
          errorType: errorType,
        });
      }
    });
  }

  async getNextRequest(channel: Channel): Promise<SongRequest> {
    // Find currently active song, if any, and mark it played.
    const prevActiveRequest = await this.getCurrentRequest(channel);
    if (prevActiveRequest) {
      prevActiveRequest.isActive = false;
      prevActiveRequest.isDone = true;
      await this.songRequestRepository.save(prevActiveRequest);
    }

    const nextRequest = await this.songRequestRepository.findOne({
      where: { channel: channel, isDone: false },
      order: { requestOrder: 'asc' },
    });

    if (nextRequest) {
      nextRequest.isActive = true;

      await this.songRequestRepository.save(nextRequest);
    }

    this.eventEmitter.emit(SongRequestQueueChangedEvent.name, {
      channel: channel,
      songRequests: await this.getAllRequests(channel),
    });

    return nextRequest;
  }

  async getCurrentRequest(channel: Channel): Promise<SongRequest> {
    return await this.songRequestRepository.findOne({
      where: { channel: channel, isActive: true },
    });
  }

  async getAllRequests(channel: Channel): Promise<SongRequest[]> {
    return await this.songRequestRepository.find({
      where: { channel: channel, isDone: false },
      order: { requestOrder: 'asc' },
    });
  }

  async removeMostRecentRequest(
    channel: Channel,
    requesterName: string
  ): Promise<SongRequest> {
    const mostRecentRequest = await this.songRequestRepository.findOne({
      where: { channel: channel, requesterName: requesterName, isDone: false },
      order: { requestOrder: 'desc' },
    });
    if (mostRecentRequest) {
      await this.songRequestRepository.remove(mostRecentRequest);
      this.eventEmitter.emit(SongRequestQueueChangedEvent.name, {
        channel: channel,
        songRequests: await this.getAllRequests(channel),
      });
      return mostRecentRequest;
    }

    return;
  }

  async clearAllRequests(channel: Channel) {
    await this.songRequestRepository.delete({ channel: channel });
    this.eventEmitter.emit(SongRequestQueueChangedEvent.name, {
      channel: channel,
      songRequests: await this.getAllRequests(channel),
    });
  }

  /**
   * Swaps the requestOrder between sourceSongRequestId and destinationSongRequestId.
   *
   * Note that this will fail if both requests do not belong to the same channel.
   */
  async swapOrder(
    sourceSongRequestId: number,
    destinationSongRequestId: number
  ) {
    const sourceSongRequest = await this.songRequestRepository.findOneBy({
      id: sourceSongRequestId,
    });

    // Find the songRequest that's present in the position we want to replace.
    const songRequestToSwap = await this.songRequestRepository.findOneBy({
      id: destinationSongRequestId,
    });
    if (!songRequestToSwap) {
      // There's nothing in that current position, which is probably an error. Fail it out.
      return;
    }

    if (
      sourceSongRequest.channel.channelName !==
      songRequestToSwap.channel.channelName
    ) {
      this.logger.warn(
        'swapOrder(): Will not swap order for 2 requests belonging to different channels',
        {
          sourceChannel: sourceSongRequest.channel.channelName,
          destinationChannel: songRequestToSwap.channel.channelName,
        }
      );
      return;
    }

    const oldRequestOrder = sourceSongRequest.requestOrder;
    sourceSongRequest.requestOrder = songRequestToSwap.requestOrder;
    songRequestToSwap.requestOrder = oldRequestOrder;

    await this.songRequestRepository.save(sourceSongRequest);
    await this.songRequestRepository.save(songRequestToSwap);

    this.eventEmitter.emit(SongRequestQueueChangedEvent.name, {
      channel: sourceSongRequest.channel,
      songRequests: await this.getAllRequests(sourceSongRequest.channel),
    });
  }

  @Cron('0 * * * *')
  async clearOldDoneRequests() {
    const maxDoneAge = 12 * 60 * 60 * 1000; // 12 hours

    const oldestTimestamp = new Date(Date.now() - maxDoneAge);

    const result = await this.songRequestRepository.delete({
      isDone: true,
      requestTimestamp: LessThanOrEqual(oldestTimestamp),
    } as FindOptionsWhere<SongRequest>);

    this.logger.log('clearOldRequests completed', {
      requestsRemoved: result.affected,
    });
  }

  async getRequestById(songRequestId: number): Promise<SongRequest> {
    return await this.songRequestRepository.findOneBy({ id: songRequestId });
  }

  async removeRequest(songRequest: SongRequest) {
    // FIXME: Add handling for if/when this throws an error.
    await this.songRequestRepository.remove(songRequest);

    this.eventEmitter.emit(SongRequestQueueChangedEvent.name, {
      channel: songRequest.channel,
      songRequests: await this.getAllRequests(songRequest.channel),
    });
  }

  async setRequestActive(songRequest: SongRequest): Promise<void> {
    // Make sure any existing active song requests are marked inactive, and set this one to active.
    // const qb = this.songRequestRepository.queryRunner.
    // qb.update().set({ isActive: false }).where({ isActive: true });
    // await qb.execute();

    await this.songRequestRepository.query(
      `UPDATE song_request SET "isActive" = false where "channelId" = '${songRequest.channel.id}' AND "isActive" = true`
    );

    songRequest.isActive = true;
    await this.songRequestRepository.save(songRequest);

    this.eventEmitter.emit(SongRequestQueueChangedEvent.name, {
      channel: songRequest.channel,
      songRequests: await this.getAllRequests(songRequest.channel),
    });
  }
}
