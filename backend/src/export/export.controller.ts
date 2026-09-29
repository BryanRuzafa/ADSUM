import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ExportService } from './export.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Exportació')
@ApiBearerAuth('access-token')
@Controller('api/export')
@UseGuards(JwtAuthGuard)
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Post('google-sheets')
  async export(@Body() dades: { modulId: number }) {
    return await this.exportService.exportToGoogleSheets(dades.modulId);
  }
}
