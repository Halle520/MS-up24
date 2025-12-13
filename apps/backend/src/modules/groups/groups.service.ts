import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createGroupDto: CreateGroupDto) {
    return this.prisma.$transaction(async (tx) => {
      const group = await tx.group.create({
        data: {
          name: createGroupDto.name,
        },
      });

      await tx.userGroup.create({
        data: {
          userId,
          groupId: group.id,
          role: 'admin',
        },
      });

      return group;
    });
  }

  async findAll(userId: string) {
    return this.prisma.group.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async invite(userId: string, groupId: string, email: string) {
    // Check membership
    const membership = await this.prisma.userGroup.findUnique({
      where: {
        userId_groupId: {
          userId,
          groupId,
        },
      },
    });

    if (!membership) {
      throw new ForbiddenException('You are not a member of this group');
    }

    // Find user by email
    const userToInvite = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!userToInvite) {
      throw new NotFoundException('User with that email not found. Please ask them to login first.');
    }

    // Check if already member
    const existingMember = await this.prisma.userGroup.findUnique({
        where: { userId_groupId: { userId: userToInvite.id, groupId } }
    });
    if (existingMember) {
        throw new ConflictException('User is already a member');
    }

    return this.prisma.userGroup.create({
      data: {
        userId: userToInvite.id,
        groupId,
      },
      include: {
        user: true,
      },
    });
  }

  async getMessages(userId: string, groupId: string) {
    const membership = await this.prisma.userGroup.findUnique({
      where: { userId_groupId: { userId, groupId } },
    });
    if (!membership) throw new ForbiddenException('Not a member');

    return this.prisma.message.findMany({
      where: { groupId },
      orderBy: { createdAt: 'asc' },
      include: { user: true, consumption: true },
    });
  }

  async sendMessage(userId: string, groupId: string, content: string, consumptionId?: string) {
    const membership = await this.prisma.userGroup.findUnique({
      where: { userId_groupId: { userId, groupId } },
    });
    if (!membership) throw new ForbiddenException('Not a member');

    return this.prisma.message.create({
      data: {
        content: content || (consumptionId ? 'sent a fee' : ''),
        userId,
        groupId,
        consumptionId,
      },
      include: { user: true, consumption: true },
    });
  }

  async findOne(userId: string, groupId: string) {
      const group = await this.prisma.group.findUnique({
          where: { id: groupId },
          include: {
              members: { include: { user: true } }
          }
      });
      if (!group) throw new NotFoundException('Group not found');

      const isMember = group.members.some(m => m.userId === userId);
      if (!isMember) throw new ForbiddenException('Not a member');

      return group;
  }
}
