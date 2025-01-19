import { Test, TestingModule } from '@nestjs/testing';
import {
  getGenericNestMock,
  getMockChannel,
  getMockChatMessage,
} from '../../../../test/helpers';
import { ChatMessage } from '@steglasaurous/chat';
import { Channel } from '../../data-store/entities/channel.entity';
import { RbsetBotCommand } from './rbset.bot-command';
import { SettingService } from '../../data-store/services/setting.service';
import { SettingDefinition } from '../../data-store/entities/setting-definition.entity';
import { I18nService } from 'nestjs-i18n';

describe('Rbset command', () => {
  let service: RbsetBotCommand;

  const channel: Channel = getMockChannel();
  const chatMessage: ChatMessage = getMockChatMessage();
  let settingServiceMock;
  let i18n;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RbsetBotCommand],
    })
      .useMocker((token) => {
        return getGenericNestMock(token);
      })
      .compile();

    service = module.get(RbsetBotCommand);
    settingServiceMock = module.get(SettingService);
    i18n = module.get(I18nService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return a description of the command', () => {
    expect(service.getDescription().length).toBeGreaterThan(1);
  });

  it('should set the given setting to the value given', async () => {
    chatMessage.message = '!rbset queuestrategy fifo';
    chatMessage.userIsBroadcaster = true;
    const mockSettingDefinition = new SettingDefinition();
    mockSettingDefinition.name = 'queuestrategy';
    mockSettingDefinition.defaultValue = 'defaultThing';
    mockSettingDefinition.choices = [];
    settingServiceMock.getSettingDefinition.mockReturnValue(
      mockSettingDefinition
    );
    settingServiceMock.setValue.mockReturnValue(Promise.resolve());
    const response = await service.execute(channel, chatMessage);

    expect(response.trim()).toEqual('chat.SettingSetToValue');
    expect(i18n.t).toHaveBeenCalled();
    expect(i18n.t.mock.calls[0][1]).toEqual({
      lang: 'en',
      args: { settingName: 'queuestrategy', value: 'fifo' },
    });
  });

  it('should do nothing if the user is not a mod or broadcaster', async () => {
    chatMessage.message = '!rbset queuestrategy fifo';
    chatMessage.userIsBroadcaster = false;
    chatMessage.userIsMod = false;

    const response = await service.execute(channel, chatMessage);
    expect(response).toEqual(undefined);
  });

  it('should return usage info if it could not parse the setting name and/or value', async () => {
    chatMessage.message = '!rbset derp';
    chatMessage.userIsBroadcaster = true;

    const response = await service.execute(channel, chatMessage);
    expect(response.trim()).toEqual('chat.RbsetUsage');
  });

  it('should return an error message if the setting name is not valid', async () => {
    chatMessage.message = '!rbset notASettingName someValue';
    chatMessage.userIsBroadcaster = true;

    settingServiceMock.getSettingDefinition.mockReturnValue(undefined);

    const response = await service.execute(channel, chatMessage);
    expect(response.trim()).toEqual('chat.InvalidSetting');
  });

  it('it should validate the setting value if choices are present', async () => {
    chatMessage.message = '!rbset queuestrategy fifo';
    chatMessage.userIsBroadcaster = true;
    const mockSettingDefinition = new SettingDefinition();
    mockSettingDefinition.name = 'queuestrategy';
    mockSettingDefinition.defaultValue = 'defaultThing';
    mockSettingDefinition.choices = ['fifo', 'someotherchoice'];
    settingServiceMock.getSettingDefinition.mockReturnValue(
      mockSettingDefinition
    );
    settingServiceMock.setValue.mockReturnValue(Promise.resolve());
    const response = await service.execute(channel, chatMessage);

    expect(response.trim()).toEqual('chat.SettingSetToValue');
    expect(i18n.t).toHaveBeenCalled();
    expect(i18n.t.mock.calls[0][1]).toEqual({
      lang: 'en',
      args: { settingName: 'queuestrategy', value: 'fifo' },
    });
  });
  it('it should not set the value if it is not a valid choice', async () => {
    chatMessage.message = '!rbset queuestrategy invalid';
    chatMessage.userIsBroadcaster = true;
    const mockSettingDefinition = new SettingDefinition();
    mockSettingDefinition.name = 'queuestrategy';
    mockSettingDefinition.defaultValue = 'defaultThing';
    mockSettingDefinition.choices = ['fifo', 'someotherchoice'];
    settingServiceMock.getSettingDefinition.mockReturnValue(
      mockSettingDefinition
    );
    settingServiceMock.setValue.mockReturnValue(Promise.resolve());
    const response = await service.execute(channel, chatMessage);

    expect(response.trim()).toEqual('chat.InvalidSettingValue');
    expect(i18n.t).toHaveBeenCalled();
    expect(i18n.t.mock.calls[0][1]).toEqual({
      lang: 'en',
      args: { values: mockSettingDefinition.choices.join(', ') },
    });
  });
});
