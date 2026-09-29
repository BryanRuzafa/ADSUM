/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { FamiliesService } from './families.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Famílies')
@ApiBearerAuth('access-token')
@Controller('api/families')
@UseGuards(JwtAuthGuard)
export class FamiliesController {
  constructor(private readonly familiesService: FamiliesService) {}

  @Get('fills')
  async obtenirFills(@Request() req) {
    // req.user.userId prové del JwtAuthGuard i JwtStrategy
    return this.familiesService.obtenirFills(req.user.userId);
  }

  @Get('fills/:id/assistencies')
  async obtenirAssistencies(@Param('id') id: string) {
    return this.familiesService.obtenirSeguimentAvui(Number(id));
  }

  @Get('fills/:id/tasques')
  async obtenirTasques(@Param('id') id: string) {
    return this.familiesService.obtenirTasquesExamens(Number(id));
  }

  @Get('fills/:id/stats')
  async obtenirStats(@Param('id') id: string) {
    return this.familiesService.obtenirStatsAlumne(Number(id));
  }

  @Get('fills/:id/professors')
  async obtenirProfessors(@Param('id') id: string) {
    return this.familiesService.obtenirProfessorsAlumne(Number(id));
  }
}
