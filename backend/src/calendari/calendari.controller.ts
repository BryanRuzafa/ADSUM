/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CalendariService } from './calendari.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Esdeveniment } from '../entities/esdeveniment.entity';

@ApiTags('Calendari')
@ApiBearerAuth('access-token')
@Controller('api/calendari')
@UseGuards(JwtAuthGuard)
export class CalendariController {
  constructor(private readonly calendariService: CalendariService) {}

  @Get()
  async obtenirTots() {
    return this.calendariService.obtenirTots();
  }

  @Post()
  async crear(@Body() dades: Partial<Esdeveniment>) {
    return this.calendariService.crear(dades);
  }

  @Delete(':id')
  async eliminar(@Param('id') id: string) {
    return this.calendariService.eliminar(Number(id));
  }
}
