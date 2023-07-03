import {
  Body,
  Controller,
  Get,
  MessageEvent,
  Param,
  Post,
  Sse,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { AssetsService } from './assets.service';

@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get()
  async all() {
    return await this.assetsService.all();
  }

  @Post()
  async create(@Body() body: { id: string; symbol: string; price: number }) {
    return await this.assetsService.create(body);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.assetsService.findOne(id);
  }

  @Sse('events')
  events(): Observable<MessageEvent> {
    return this.assetsService.subscribeEvents().pipe(
      map((event) => ({
        type: event.event,
        data: event.data,
      })),
    );
  }
}
