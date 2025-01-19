import { Channel } from './channel.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserBotState {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  requesterName: string;
  @ManyToOne(() => Channel, (channel) => channel.userBotStates)
  channel: Channel;
  @Column({ type: 'simple-json', nullable: true })
  state: object;
  @Column({ type: 'timestamptz' })
  timestamp: Date;
}
