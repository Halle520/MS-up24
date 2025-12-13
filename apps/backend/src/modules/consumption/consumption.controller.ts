import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConsumptionService } from './consumption.service';
import { CreateConsumptionDto } from './dto/create-consumption.dto';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { User } from '@prisma/client';

@Controller('consumption')
@UseGuards(AuthGuard('jwt'))
export class ConsumptionController {
  constructor(private readonly consumptionService: ConsumptionService) {}

  @Post()
  create(@CurrentUser() user: User, @Body() createConsumptionDto: CreateConsumptionDto) {
    return this.consumptionService.create(user.id, createConsumptionDto);
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.consumptionService.findAll(user.id);
  }
}
