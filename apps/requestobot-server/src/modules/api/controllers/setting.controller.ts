import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Logger,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SettingDto } from '@requestobot/util-dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiBody, ApiCookieAuth, ApiOperation } from '@nestjs/swagger';
import { ChannelManagerService } from '../../channel-manager/services/channel-manager.service';
import { SettingService } from '../../data-store/services/setting.service';
import { DtoMappingService } from '../../data-store/services/dto-mapping.service';
import { SettingDto as SettingDtoClass } from '../dto/setting.dto';
@Controller('api/channels/:channelId/settings')
export class SettingController {
  private logger: Logger = new Logger(this.constructor.name);

  constructor(
    private readonly channelManager: ChannelManagerService,
    private readonly settingService: SettingService,
    private readonly dtoMappingService: DtoMappingService
  ) {}
  @ApiOperation({
    tags: ['Setting'],
  })
  @ApiBody({
    type: SettingDtoClass,
  })
  @ApiCookieAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Put('/:settingName')
  async updateSetting(
    @Param('channelId') channelId: number,
    @Param('settingName') settingName: string,
    @Body() setting: SettingDto,
    @Req() request: Request
  ) {
    const channel = await this.channelManager.getChannelById(channelId);

    if (!channel) {
      throw new BadRequestException('Channel does not exist');
    }

    if (channel.channelName != request['user'].username) {
      throw new BadRequestException(
        'Only broadcasters can modify their channels'
      );
    }

    const settingDefinition = await this.settingService.getSettingDefinition(
      settingName
    );
    if (!settingDefinition) {
      throw new BadRequestException('Setting name is not valid');
    }

    const newValue = await this.settingService.setValue(
      channel,
      settingDefinition,
      setting.value
    );

    if (!newValue) {
      throw new InternalServerErrorException(
        'Unable to save new value for setting'
      );
    }

    return this.dtoMappingService.settingToDto(newValue);
  }
}
