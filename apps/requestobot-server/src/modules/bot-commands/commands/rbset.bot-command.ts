import { BaseBotCommand } from './base.bot-command';
import { Channel } from '../../data-store/entities/channel.entity';
import { ChatMessage } from '@steglasaurous/chat';
import { SettingService } from '../../data-store/services/setting.service';
import { I18nService } from 'nestjs-i18n';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RbsetBotCommand extends BaseBotCommand {
  constructor(
    private settingService: SettingService,
    private i18n: I18nService
  ) {
    super();

    this.triggers = ['!rbset'];
  }

  async execute(channel: Channel, chatMessage: ChatMessage): Promise<string> {
    if (!chatMessage.userIsMod && !chatMessage.userIsBroadcaster) {
      return;
    }

    // Parse out the request
    const settingRequest = chatMessage.message.matchAll(
      /!rbset (?<settingDefinition>[A-Za-z0-9]*) (?<value>[A-Za-z0-9]*)/g
    );

    // We only care about the first element, hence why we don't use a for..of
    const match: RegExpMatchArray = settingRequest.next().value;
    if (!match) {
      return this.i18n.t('chat.RbsetUsage', { lang: channel.lang });
    }
    const settingName = match.groups.settingDefinition.toLowerCase();
    const value = match.groups.value.toLowerCase();

    const settingDefinition = await this.settingService.getSettingDefinition(
      settingName
    );

    if (!settingDefinition) {
      return this.i18n.t('chat.InvalidSetting', { lang: channel.lang });
    }

    // If this setting definition has choices, make sure the value matches.
    if (settingDefinition.choices.length > 0) {
      // Make sure the value is in the array
      if (!settingDefinition.choices.includes(value)) {
        return this.i18n.t('chat.InvalidSettingValue', {
          lang: channel.lang,
          args: {
            values: settingDefinition.choices.join(', '),
          },
        });
      }
    }

    // Now that we have the correct definition, create or update the setting in the setting table.
    await this.settingService.setValue(channel, settingDefinition, value);

    return this.i18n.t('chat.SettingSetToValue', {
      lang: channel.lang,
      args: {
        settingName: settingDefinition.name,
        value: value,
      },
    });
  }

  getDescription(): string {
    return 'Sets a requestobot setting for the channel.';
  }
}
