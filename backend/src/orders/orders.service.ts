import { Injectable } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { InitTransactionDto, InputExecuteTransactionDto } from './order.dto';

@Injectable()
export class OrdersService {
  constructor(private prismaService: PrismaService) {}

  async all(filter: { wallet_id: string }) {
    return await this.prismaService.order.findMany({
      where: {
        wallet_id: filter.wallet_id,
      },
      include: {
        Asset: {
          select: {
            id: true,
            symbol: true,
          },
        },
      },
      orderBy: {
        updated_at: 'desc',
      },
    });
  }

  async initTransaction(input: InitTransactionDto) {
    //prismaService.$use()

    const order = await this.prismaService.order.create({
      data: {
        asset_id: input.asset_id,
        wallet_id: input.wallet_id,
        shares: input.shares,
        partial: input.shares,
        price: input.price,
        type: input.type,
        status: OrderStatus.PENDING,
      },
    });
    return order;
  }

  async executeTransaction(input: InputExecuteTransactionDto) {
    // add transaction to order
    // count the amount of assets in the wallet
    // update the order status to OPEN or CLOSED
    // update the asset price
  }
}
