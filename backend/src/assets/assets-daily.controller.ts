import { Controller, Get, MessageEvent, Param, Sse } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { AssetsDailyService } from './assets-daily.service';

@Controller('assets/:id/daily')
export class AssetsDailyController {
  constructor(private readonly assetsDailyService: AssetsDailyService) {}

  @Get()
  async all(@Param('id') id: string) {
    return await this.assetsDailyService.findAll(id);
  }

  @Sse('events')
  events(@Param('id') id: string): Observable<MessageEvent> {
    return this.assetsDailyService.subscribeEvents(id).pipe(
      map((event) => ({
        type: event.event,
        data: event.data,
      })),
    );
  }
}
