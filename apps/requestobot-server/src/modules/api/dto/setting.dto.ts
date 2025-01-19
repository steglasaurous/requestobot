import { SettingDto as SettingDtoInterface } from '@requestobot/util-dto';
import { ApiProperty } from '@nestjs/swagger';

export class SettingDto implements SettingDtoInterface {
  @ApiProperty()
  channelId: number;
  @ApiProperty()
  settingName: string;
  @ApiProperty()
  value: string;
}
