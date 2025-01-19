import { Injectable } from '@nestjs/common';
import { SettingDefinition } from '../entities/setting-definition.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from '../entities/setting.entity';
import { Channel } from '../entities/channel.entity';

@Injectable()
export class SettingService {
  constructor(
    @InjectRepository(SettingDefinition)
    private settingDefinitionRepository: Repository<SettingDefinition>,
    @InjectRepository(Setting) private settingRepository: Repository<Setting>
  ) {}
  async getSettingDefinition(
    settingDefinitionName: string
  ): Promise<SettingDefinition | undefined> {
    return await this.settingDefinitionRepository.findOneBy({
      name: settingDefinitionName,
    });
  }

  async setValue(
    channel: Channel,
    settingDefinition: SettingDefinition,
    value: string
  ): Promise<Setting> {
    let settingValue = await this.settingRepository.findOne({
      where: {
        channel: channel,
        settingName: {
          name: settingDefinition.name,
        },
      },
    });

    if (!settingValue) {
      settingValue = new Setting();
      settingValue.settingName = settingDefinition;
      settingValue.channel = channel;
    }
    settingValue.value = value;

    // If this is a choice field, validate the value before we write it.
    if (settingDefinition.choices) {
      for (const choice of settingDefinition.choices) {
        if (value === choice) {
          return await this.settingRepository.save(settingValue);
        }
      }

      throw new Error(
        'Setting value is invalid. Valid choices are: ' +
          settingDefinition.choices.join(',')
      );
    }
  }

  async getValue(
    channel: Channel,
    settingName: string
  ): Promise<string | undefined> {
    const settingDefinition = await this.getSettingDefinition(settingName);
    if (!settingDefinition) {
      return undefined;
    }
    const settingValue = await this.settingRepository.findOne({
      where: {
        channel: channel,
        settingName: {
          name: settingDefinition.name,
        },
      },
    });
    if (!settingValue) {
      return settingDefinition.defaultValue;
    }

    return settingValue.value;
  }
}
