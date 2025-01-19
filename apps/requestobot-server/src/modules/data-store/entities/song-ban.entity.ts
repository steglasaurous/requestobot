import { Song } from './song.entity';
import { Channel } from './channel.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['channel', 'song'])
export class SongBan {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Song, {
    eager: true,
    nullable: false,
  })
  song: Song;

  @ManyToOne(() => Channel, (channel) => channel.songBans, {
    nullable: false,
  })
  channel: Channel;
}
