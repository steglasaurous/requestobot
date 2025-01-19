import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Channel } from './channel.entity';
import { SettingDefinition } from './setting-definition.entity';

@Entity()
/**
 * Generic setting mechanism - this associates a setting and its value to a channel.
 */
export class Setting {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Channel, (channel) => channel.requests, {
    eager: true,
    nullable: false,
  })
  channel: Channel;

  @ManyToOne(
    () => SettingDefinition,
    (settingDefinition) => settingDefinition.settings,
    { eager: true, nullable: false },
  )
  settingName: SettingDefinition;

  @Column()
  value: string;
}
