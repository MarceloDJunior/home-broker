import { Body, Controller, Get, Post } from '@nestjs/common';
import { WalletsService } from './wallets.service';

@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Get()
  async all() {
    return await this.walletsService.all();
  }

  @Post()
  async create(@Body() body: { id: string }) {
    return await this.walletsService.create(body);
  }
}
