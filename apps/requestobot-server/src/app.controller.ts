import { Controller, Get, Redirect } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Redirect('https://twitch.tv/requestobot')
  get(): void {
    return;
  }
}
