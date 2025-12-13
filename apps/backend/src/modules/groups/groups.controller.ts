import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { User } from '@prisma/client';

@Controller('groups')
@UseGuards(AuthGuard('jwt'))
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  create(@CurrentUser() user: User, @Body() createGroupDto: CreateGroupDto) {
    return this.groupsService.create(user.id, createGroupDto);
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.groupsService.findAll(user.id);
  }

  @Get(':id')
  findOne(@CurrentUser() user: User, @Param('id') id: string) {
    return this.groupsService.findOne(user.id, id);
  }

  @Post(':id/invite')
  invite(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() inviteMemberDto: InviteMemberDto,
  ) {
    return this.groupsService.invite(user.id, id, inviteMemberDto.email);
  }

  @Get(':id/messages')
  getMessages(@CurrentUser() user: User, @Param('id') id: string) {
    return this.groupsService.getMessages(user.id, id);
  }

  @Post(':id/messages')
  sendMessage(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() sendMessageDto: SendMessageDto,
  ) {
    return this.groupsService.sendMessage(user.id, id, sendMessageDto.content, sendMessageDto.consumptionId);
  }
}
