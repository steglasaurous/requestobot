import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Song } from './song.entity';
import { Channel } from './channel.entity';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  displayName: string;

  // The game name that's matched when using !setgame
  @Column()
  setGameName: string;

  @Column({ nullable: true })
  twitchCategoryId: string;
  @OneToMany(() => Song, (song) => song.requests)
  songs: Song[];

  @OneToMany(() => Channel, (channel) => channel.game)
  channels: Channel[];

  // URL to the game's cover art, if available.  I try to use links to igdb.com.
  @Column({ nullable: true })
  coverArtUrl?: string;

  /**
   * If set to true, this will expose traditional player controls on the client
   * (play/pause, next/previous track, volume, etc)
   */
  @Column({ default: false })
  enablePlayerControls: boolean;
}
