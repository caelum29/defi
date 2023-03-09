import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('balances')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getBalances(): Promise<any> {
    return this.appService.getBalances();
  }
}
