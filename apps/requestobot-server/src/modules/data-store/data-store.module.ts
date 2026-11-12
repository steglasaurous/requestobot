import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DtoMappingService } from './services/dto-mapping.service';
import { UserService } from './services/user.service';
import { SettingService } from './services/setting.service';
import { BotStateService } from './services/bot-state.service';
import { PlayerService } from './services/player.service';
import { entityList } from './models/entity-list';

@Module({
  imports: [TypeOrmModule.forFeature(entityList)],
  exports: [
    TypeOrmModule,
    DtoMappingService,
    UserService,
    SettingService,
    BotStateService,
    PlayerService,
  ],
  providers: [
    DtoMappingService,
    UserService,
    SettingService,
    BotStateService,
    PlayerService,
  ],
})
export class DataStoreModule {}
