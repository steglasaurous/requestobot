import { Controller, Get } from '@nestjs/common';

@Controller('')
export class ClientLauncherController {
  @Get('launch')
  launch() {
    return 'Success!';
  }
}
