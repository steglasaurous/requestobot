import { Module } from '@nestjs/common';
import { ClientLauncherController } from './controllers/client-launcher.controller';

@Module({
  controllers: [ClientLauncherController],
})
export class ClientLauncherModule {}
