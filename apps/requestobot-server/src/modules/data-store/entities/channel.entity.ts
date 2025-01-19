import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SongRequest } from './song-request.entity';
import { UserBotState } from './user-bot-state.entity';
import { Game } from './game.entity';
import { SongBan } from './song-ban.entity';
import { ChatServiceName } from '@steglasaurous/chat';
import { Setting } from './setting.entity';

@Entity()
@Index(['channelName', 'chatServiceName'], { unique: true })
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  channelName: string;

  @Column({
    default: ChatServiceName.TWITCH,
    type: 'enum',
    enum: ChatServiceName,
  })
  chatServiceName: ChatServiceName;

  /**
   * If true, indicates it is in the channel (and/or should join this channel)
   */
  @Column()
  inChannel: boolean;

  /**
   * Indicate whether the bot is enabled in this channel. (for keeping the bot around, but not have it respond to commands)
   */
  @Column({ default: true })
  enabled: boolean;

  /**
   * When the bot last joined the channel (i.e. was last invited via !join command)
   */
  @Column({ type: 'timestamptz' })
  joinedOn: Date;

  @Column({ default: true })
  queueOpen: boolean;

  /**
   * When the bot was last asked to leave via !getout
   */
  @Column({ nullable: true, type: 'timestamptz' })
  leftOn?: Date;

  @OneToMany(() => SongRequest, (songRequest) => songRequest.channel)
  requests: SongRequest[];

  @OneToMany(() => UserBotState, (userBotState) => userBotState.channel, {
    nullable: true,
  })
  userBotStates: UserBotState[];

  /**
   * If populated, this is the game it should search song requests for.  If null, the bot is effectively disabled.
   */
  @ManyToOne(() => Game, (game) => game.channels, { eager: true })
  game?: Game;

  /**
   * The language to use when sending chat messages. Defaults to English.
   */
  @Column({ default: 'en' })
  lang: string;

  @OneToMany(() => SongBan, (songBan) => songBan.channel)
  songBans: SongBan[];

  @OneToMany(() => Setting, (setting) => setting.channel)
  settings: Promise<Setting[]>;
}
