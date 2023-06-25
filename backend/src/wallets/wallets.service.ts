import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WalletsService {
  constructor(private prismaService: PrismaService) {}

  async all() {
    return await this.prismaService.wallet.findMany();
  }

  async create(data: { id: string }) {
    return await this.prismaService.wallet.create({ data: { id: data.id } });
  }
}
