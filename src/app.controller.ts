import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  start(): string {
    return this.appService.getHello();
  }

  @Get('getTokens')
  getTokens(): string {
    return 'List of tokens';
  }
}
