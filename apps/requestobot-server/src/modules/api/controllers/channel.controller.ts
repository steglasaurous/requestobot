import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { ChannelDto } from '@requestobot/util-dto';
import { DtoMappingService } from '../../data-store/services/dto-mapping.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from '../../data-store/entities/channel.entity';
import { Repository } from 'typeorm';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { ChannelDto as ChannelDtoClass } from '../dto/channel.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { I18nService } from 'nestjs-i18n';
import { Game } from '../../data-store/entities/game.entity';
import { ChatManagerService, ChatServiceName } from '@steglasaurous/chat';
import { ChannelManagerService } from '../../channel-manager/services/channel-manager.service';
import { MessageFormatterService } from '../../bot-commands/services/message-formatter.service';

@Controller('api/channels')
export class ChannelController {
  private logger: Logger = new Logger(this.constructor.name);
  constructor(
    private dtoMappingService: DtoMappingService,
    @InjectRepository(Channel) private channelRepository: Repository<Channel>,
    @InjectRepository(Game) private gameRepository: Repository<Game>,
    private i18n: I18nService,
    private chatManager: ChatManagerService,
    private channelManager: ChannelManagerService,
    private messageFormatterService: MessageFormatterService
  ) {}

  @ApiOperation({
    summary: 'Get general details about the given channel',
    tags: ['Channel'],
  })
  @ApiParam({
    name: 'chatServiceName',
    required: true,
    type: 'string',
    description:
      "The chat service name the channel belongs to.  Currently only 'twitch' is supported.",
  })
  @ApiOkResponse({
    type: ChannelDtoClass,
  })
  @Get('/:chatServiceName/:channelName')
  async getChannelDetails(
    @Param('chatServiceName') chatServiceName: ChatServiceName,
    @Param('channelName') channelName: string
  ): Promise<ChannelDto> {
    const channel = await this.channelManager.getChannel(
      channelName,
      chatServiceName
    );

    if (!channel) {
      throw new NotFoundException(`Channel ${channelName} does not exist`);
    }

    return await this.dtoMappingService.channelToDto(channel);
  }

  @ApiOperation({
    summary:
      'Get channel details about the given channel by id.  Note this requires authentication.',
    tags: ['Channel'],
  })
  @ApiOkResponse({
    type: ChannelDtoClass,
  })
  @ApiCookieAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Get('/:channelId')
  async getChannelDetailsById(
    @Param('channelId') channelId: number
  ): Promise<ChannelDto> {
    const channel = await this.channelManager.getChannelById(channelId);

    if (!channel) {
      throw new NotFoundException(`channelId ${channelId} does not exist`);
    }

    return await this.dtoMappingService.channelToDto(channel);
  }

  @ApiCookieAuth('jwt')
  @ApiOperation({
    description:
      'Modify a channel.  Note only enabled, queueOpen and game are modifiable, all others are read-only.',
    tags: ['Channel'],
  })
  @UseGuards(JwtAuthGuard)
  @Put('/:chatServiceName/:channelName')
  async updateChannelDetails(
    @Param('channelName') channelName: string,
    @Param('chatServiceName') chatServiceName: ChatServiceName,
    @Body() channelDto: ChannelDto,
    @Req() request: Request
  ): Promise<ChannelDto> {
    // enabled, queueOpen, game should be modifiable.  All others are not.
    // Only broadcasters or mods can modify.
    const channel = await this.channelManager.getChannel(
      channelName,
      chatServiceName
    );

    if (!channel) {
      throw new BadRequestException('Channel does not exist');
    }

    if (channel.channelName != request['user'].username) {
      throw new BadRequestException(
        'Only broadcasters can modify their channels'
      );
    }
    return this.doUpdateChannelDetails(channel, channelDto);
  }

  @ApiCookieAuth('jwt')
  @ApiOperation({
    description:
      'Modify a channel by channelId.  Note only enabled, queueOpen and game are modifiable, all others are read-only.',
    tags: ['Channel'],
  })
  @UseGuards(JwtAuthGuard)
  @Put('/:channelId')
  public async updateChannelDetailsById(
    @Param('channelId') channelId: number,
    @Body() channelDto: ChannelDto,
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
    return this.doUpdateChannelDetails(channel, channelDto);
  }

  @ApiCookieAuth('jwt')
  @ApiOperation({
    summary: 'Create a new channel',
    description:
      'Note: if inChannel is set to true, the bot will automatically join the channel on creation',
    tags: ['Channel'],
  })
  @ApiBody({
    type: ChannelDtoClass,
  })
  @ApiOkResponse({
    type: ChannelDtoClass,
  })
  @ApiBadRequestResponse({
    description:
      'Returned if the channel name does not match the current username.  Users can only create channels they own.',
  })
  @ApiUnprocessableEntityResponse({
    description: 'If the channel already exists.',
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  async createChannel(
    @Body() channelDto: ChannelDto,
    @Req() request: Request
  ): Promise<ChannelDto> {
    if (channelDto.channelName !== request['user'].username) {
      throw new BadRequestException(
        `Only broadcasters can create their own channels. Cannot create channel ${channelDto.channelName} for user ${request['user'].username}`
      );
    }

    const existingChannel = await this.channelManager.getChannel(
      channelDto.channelName,
      channelDto.chatServiceName as ChatServiceName
    );

    if (existingChannel) {
      throw new UnprocessableEntityException('Channel already exists.');
    }
    let game: Game;
    if (channelDto.game) {
      game = await this.gameRepository.findOneBy({
        name: channelDto.game.name,
      });
    }

    const channel = await this.channelManager.createChannel(
      channelDto.channelName,
      channelDto.chatServiceName as ChatServiceName,
      'en',
      channelDto.inChannel ?? true,
      channelDto.queueOpen ?? true,
      channelDto.enabled ?? true,
      game ?? null
    );

    return await this.dtoMappingService.channelToDto(channel);
  }

  private async doUpdateChannelDetails(
    channel: Channel,
    channelDto: ChannelDto
  ): Promise<ChannelDto> {
    const chatMessageToEmit = [];

    if (
      channelDto.enabled != undefined &&
      channelDto.enabled != channel.enabled
    ) {
      // FIXME: Move to the channel-manager so it can deal with messaging.
      channel.enabled = channelDto.enabled;
      if (channel.enabled) {
        chatMessageToEmit.push(
          this.messageFormatterService.formatMessage(
            this.i18n.t('chat.BotIsOn', {
              lang: channel.lang,
            })
          )
        );
      } else {
        chatMessageToEmit.push(
          this.messageFormatterService.formatMessage(
            this.i18n.t('chat.BotIsOff', { lang: channel.lang })
          )
        );
      }
    }

    if (
      channelDto.queueOpen != undefined &&
      channelDto.queueOpen != channel.queueOpen
    ) {
      channel.queueOpen = channelDto.queueOpen;
      if (channel.queueOpen) {
        chatMessageToEmit.push(
          this.messageFormatterService.formatMessage(
            this.i18n.t('chat.QueueOpen', { lang: channel.lang })
          )
        );
      } else {
        chatMessageToEmit.push(
          this.messageFormatterService.formatMessage(
            this.i18n.t('chat.QueueClosed', { lang: channel.lang })
          )
        );
      }
      // Emit the appropriate message to chat.
    }
    if (channelDto.game != undefined && channelDto.game.id != undefined) {
      // Validate the game setting
      const game = await this.gameRepository.findOneBy({
        id: channelDto.game.id,
      });
      if (!game) {
        throw new BadRequestException('Game id provided is invalid');
      }

      // FIXME: Clear queue when changing games
      // FIXME: Consider a service to deal with this stuff.
      channel.game = game;
    }

    await this.channelRepository.save(channel);

    if (chatMessageToEmit.length > 0) {
      for (const chatMessageToEmitElement of chatMessageToEmit) {
        await this.chatManager
          .getChatClientForChatServiceName(channel.chatServiceName)
          .sendMessage(channel.channelName, chatMessageToEmitElement);
      }
    }

    return await this.dtoMappingService.channelToDto(channel);
  }
}
