import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Asset } from '@prisma/client';
import { Model } from 'mongoose';
import { Observable } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { Asset as AssetSchema } from './asset.schema';

@Injectable()
export class AssetsService {
  constructor(
    private prismaService: PrismaService,
    @InjectModel(AssetSchema.name)
    private assetSchema: Model<AssetSchema>,
  ) {}

  async all() {
    return await this.prismaService.asset.findMany();
  }

  async create(data: { id: string; symbol: string; price: number }) {
    return await this.prismaService.asset.create({ data });
  }

  async findOne(id: string) {
    return await this.prismaService.asset.findUnique({ where: { id } });
  }

  subscribeEvents(): Observable<{
    event: 'asset-price-changed';
    data: Asset;
  }> {
    return new Observable((observer) => {
      this.assetSchema
        .watch(
          [
            {
              $match: {
                operationType: 'update',
              },
            },
          ],
          {
            fullDocument: 'updateLookup',
          },
        )
        .on('change', async (data) => {
          console.log(data);
          const asset = await this.prismaService.asset.findUnique({
            where: {
              id: String(data.fullDocument._id),
            },
          });
          observer.next({
            event: 'asset-price-changed',
            data: asset,
          });
        });
    });
  }
}
