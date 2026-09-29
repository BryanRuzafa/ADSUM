/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CercaService } from './cerca.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Cerca')
@ApiBearerAuth('access-token')
@Controller('api/cerca')
@UseGuards(JwtAuthGuard)
export class CercaController {
  constructor(private readonly cercaService: CercaService) {}

  @Get()
  async search(@Query('q') q: string) {
    return this.cercaService.globalSearch(q);
  }
}
