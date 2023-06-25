import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { InitTransactionDto, InputExecuteTransactionDto } from './order.dto';
import { OrdersService } from './orders.service';

@Controller('wallets/:wallet_id/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async all(@Param('wallet_id') wallet_id: string) {
    return await this.ordersService.all({ wallet_id });
  }

  @Post()
  async initTransaction(
    @Param('wallet_id') wallet_id: string,
    @Body() body: Omit<InitTransactionDto, 'wallet_id'>,
  ) {
    return await this.ordersService.initTransaction({ wallet_id, ...body });
  }

  @Post('execute')
  async executeTransaction(@Body() body: InputExecuteTransactionDto) {
    await this.ordersService.executeTransaction(body);
  }
}
