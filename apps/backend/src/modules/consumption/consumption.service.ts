import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';
import { CreateConsumptionDto } from './dto/create-consumption.dto';

@Injectable()
export class ConsumptionService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateConsumptionDto) {
    if (dto.groupId) {
      // Check membership if group is specified
       const membership = await this.prisma.userGroup.findUnique({
        where: { userId_groupId: { userId, groupId: dto.groupId } },
      });
      if (!membership) throw new ForbiddenException('Not a member of this group');
    }

    return this.prisma.consumption.create({
      data: {
        amount: dto.amount,
        description: dto.description,
        date: dto.date || new Date(),
        userId,
        groupId: dto.groupId,
      },
      include: {
          user: true,
          group: true,
      }
    });
  }

  async findAll(userId: string) {
    return this.prisma.consumption.findMany({
      where: {
        OR: [
            { userId }, // My consumption
            { group: { members: { some: { userId } } } } // Group consumption
        ]
      },
      orderBy: { date: 'desc' },
      include: { user: true, group: true }
    });
  }
}
