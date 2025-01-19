import { Song } from './song.entity';
import { Channel } from './channel.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['channel', 'song'])
export class SongRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Song, (song) => song.requests, {
    eager: true,
    nullable: false,
  })
  song: Song;

  @Column()
  requesterName: string;

  @Column({ type: 'timestamptz' })
  requestTimestamp: Date;

  // This maintains specific ordering of requests, regardless of priority.
  // Useful when the user has one-per-user ordering enabled and wants to manually change the order
  // of certain requests.  This will retain manual ordering while still allowing
  // the one-per-user queue strategy to work normally.
  @Column({ type: 'float' })
  requestOrder: number;

  // This is used mainly for one-per-user ordering - to determine what group to get
  // the max requestOrder from so it can maintain the request order appropriately.
  @Column({ default: 0 })
  requestPriority: number;

  @Column({ default: false })
  isActive: boolean;

  @Column({ default: false })
  isDone: boolean;

  @ManyToOne(() => Channel, (channel) => channel.requests, {
    eager: true,
    nullable: false,
  })
  channel: Channel;
}
