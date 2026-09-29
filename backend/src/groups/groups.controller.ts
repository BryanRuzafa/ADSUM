/* eslint-disable prettier/prettier */
import { Controller, Get, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grup } from '../entities/grup.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Grups')
@ApiBearerAuth('access-token')
@Controller('api/grups')
export class GroupsController {
  constructor(
    @InjectRepository(Grup)
    private grupRepo: Repository<Grup>,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllGroups() {
    return this.grupRepo.find({
      relations: ['alumnes'],
    });
  }
}