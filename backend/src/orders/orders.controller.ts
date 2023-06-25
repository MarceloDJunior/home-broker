import { Body, Controller, Post } from '@nestjs/common';
import { InitTransactionDto } from './order.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async initTransaction(@Body() body: InitTransactionDto) {
    return await this.ordersService.initTransaction(body);
  }

  async executeTransaction() {
    await this.ordersService.executeTransaction({} as any);
  }
}
