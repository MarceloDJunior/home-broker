import { Injectable } from '@nestjs/common';
import { OrderStatus, OrderType } from '@prisma/client';
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
        Transactions: true,
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
        version: 1,
      },
    });
    return order;
  }

  async executeTransaction(input: InputExecuteTransactionDto) {
    // discard all the updates if one of the database changes fail
    await this.prismaService.$transaction(async (prisma) => {
      // get related order
      const order = await prisma.order.findUniqueOrThrow({
        where: { id: input.order_id },
      });
      // update order adding the transaction
      await prisma.order.update({
        where: {
          id: input.order_id,
          version: order.version, // Used to deal with concurrent requests. It will only update if it's the same version of the order retrieved
        },
        data: {
          partial: order.partial - input.negotiated_shares,
          status: input.status,
          Transactions: {
            create: {
              broker_transaction_id: input.broker_transaction_id,
              related_investor_id: input.related_investor_id,
              shares: input.negotiated_shares,
              price: input.price,
            },
          },
          version: { increment: 1 },
        },
      });
      if (input.status === OrderStatus.CLOSED) {
        await prisma.asset.update({
          where: { id: order.asset_id },
          data: {
            price: input.price,
          },
        });
        const walletAsset = await prisma.walletAsset.findUnique({
          where: {
            wallet_id_asset_id: {
              asset_id: order.asset_id,
              wallet_id: order.wallet_id,
            },
          },
        });
        if (walletAsset) {
          // if it already has the asset in the wallet, update the amount
          await prisma.walletAsset.update({
            where: {
              wallet_id_asset_id: {
                asset_id: order.asset_id,
                wallet_id: order.wallet_id,
              },
              version: order.version,
            },
            data: {
              shares:
                order.type === OrderType.BUY
                  ? walletAsset.shares + order.shares
                  : walletAsset.shares - order.shares,
              version: { increment: 1 },
            },
          });
        } else {
          // only add to the wallet if it's a BUY order
          await prisma.walletAsset.create({
            data: {
              asset_id: order.asset_id,
              wallet_id: order.wallet_id,
              shares: input.negotiated_shares,
              version: 1,
            },
          });
        }
      }
    });
  }
}
