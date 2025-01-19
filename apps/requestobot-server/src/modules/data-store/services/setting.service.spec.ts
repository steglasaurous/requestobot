import { Test, TestingModule } from '@nestjs/testing';
import { SettingService } from './setting.service';
import { getGenericNestMock, getMockChannel } from '../../../../test/helpers';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Setting } from '../entities/setting.entity';
import { SettingDefinition } from '../entities/setting-definition.entity';
import { Repository } from 'typeorm';

describe('SettingService', () => {
  let service: SettingService;
  let mockSettingRepo;
  let mockSettingDefinitionRepo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SettingService],
    })
      .useMocker((token) => {
        switch (token) {
          case getRepositoryToken(Setting):
          case getRepositoryToken(SettingDefinition):
            return {
              findOneBy: jest.fn(),
              findOne: jest.fn(),
              save: jest.fn(),
            };
          default:
            return getGenericNestMock(token);
        }
      })
      .compile();

    service = module.get<SettingService>(SettingService);
    mockSettingRepo = module.get<Repository<Setting>>(
      getRepositoryToken(Setting),
    );
    mockSettingDefinitionRepo = module.get<Repository<SettingDefinition>>(
      getRepositoryToken(SettingDefinition),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return the setting definition of the given setting name', async () => {
    const settingDefinition = new SettingDefinition();
    settingDefinition.name = 'testdefinition';

    mockSettingDefinitionRepo.findOneBy.mockReturnValue(
      Promise.resolve(settingDefinition),
    );

    const result = await service.getSettingDefinition('testsetting');
    expect(result.name).toEqual('testdefinition');
  });

  it('should set a setting value', async () => {
    const settingDefinition = new SettingDefinition();
    settingDefinition.name = 'testdefinition';

    const channel = getMockChannel();
    const value = 'testvalue';

    mockSettingRepo.findOne.mockReturnValue(Promise.resolve());
    mockSettingRepo.save.mockReturnValue(Promise.resolve());

    await service.setValue(channel, settingDefinition, value);

    expect(mockSettingRepo.findOne).toHaveBeenCalledWith({
      where: {
        channel: channel,
        settingName: {
          name: 'testdefinition',
        },
      },
    });

    expect(mockSettingRepo.save).toHaveBeenCalledWith({
      settingName: settingDefinition,
      channel: channel,
      value: value,
    });
  });

  it('should update an existing setting', async () => {
    const settingDefinition = new SettingDefinition();
    settingDefinition.name = 'testdefinition';

    const channel = getMockChannel();
    const value = 'testvalue';
    const settingValue = new Setting();
    settingValue.settingName = settingDefinition;
    settingValue.channel = channel;
    settingValue.id = 1;
    settingValue.value = 'oldvalue';

    mockSettingRepo.findOne.mockReturnValue(Promise.resolve(settingValue));
    mockSettingRepo.save.mockReturnValue(Promise.resolve());

    await service.setValue(channel, settingDefinition, value);

    expect(mockSettingRepo.findOne).toHaveBeenCalledWith({
      where: {
        channel: channel,
        settingName: {
          name: settingDefinition.name,
        },
      },
    });

    expect(mockSettingRepo.save).toHaveBeenCalledWith({
      settingName: settingDefinition,
      channel: channel,
      value: value,
      id: 1,
    });
  });
});
