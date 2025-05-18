import { Player } from '../entities/player.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from '../entities/channel.entity';
import { PlayerState } from '../models/player-state.enum';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PlayerStateChangeEvent } from '../events/player-state-change.event';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player) private playerRepository: Repository<Player>,
    private eventEmitter: EventEmitter2
  ) {}
  public async getPlayer(channel: Channel): Promise<Player> {
    let player = await this.playerRepository.findOneBy({
      channel: channel,
    });
    if (!player) {
      player = new Player();
      player.channel = channel;
      player.state = PlayerState.Stopped;

      await this.playerRepository.save(player);
    }

    return player;
  }

  public async savePlayer(player: Player): Promise<Player> {
    const playerResponse = await this.playerRepository.save(player);

    this.eventEmitter.emit(PlayerStateChangeEvent.name, {
      song: player.song,
      channel: player.channel,
      state: player.state,
    });

    return playerResponse;
  }
}
