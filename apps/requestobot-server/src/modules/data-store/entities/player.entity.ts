import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Channel } from './channel.entity';
import { PlayerState } from '../models/player-state.enum';
import { Song } from './song.entity';

@Entity()
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Channel, (channel) => channel.player, {
    eager: true,
    nullable: false,
  })
  @JoinColumn()
  channel: Channel;

  @ManyToOne(() => Song, { nullable: true, eager: true })
  song: Song;

  @Column({
    default: PlayerState.Stopped,
    type: 'enum',
    enum: PlayerState,
    nullable: false,
  })
  state: PlayerState;

  @Column({
    default: 100,
    type: 'int',
  })
  volume: number;
}
