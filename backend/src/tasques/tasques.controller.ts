import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TasquesService } from './tasques.service';
import { CrearTascaDto } from './dto/crear-tasca.dto';
import { ActualitzarTascaDto } from './dto/actualitzar-tasca.dto';
import { TascaEstat, ChecklistItem } from '../entities/tasca-deure.entity';

@ApiTags('Tasques / Deures')
@ApiBearerAuth('access-token')
@Controller('api/tasques')
@UseGuards(JwtAuthGuard)
export class TasquesController {
  constructor(private readonly tasquesService: TasquesService) {}

  @Get('moduls')
  async moduls(@Req() req: { user: { id: number } }) {
    return this.tasquesService.llistarModuls(req.user.id);
  }

  @Get('estadistiques')
  async estadistiques(@Req() req: { user: { id: number } }) {
    return this.tasquesService.obtenirEstadistiques(req.user.id);
  }

  @Get('meves')
  async meves(
    @Req() req: { user: { id: number } },
    @Query('estat') estat?: TascaEstat,
    @Query('modulId') modulId?: string,
    @Query('prioritat') prioritat?: string,
    @Query('tipus') tipus?: string,
    @Query('cerca') cerca?: string,
    @Query('ordre') ordre?: 'data_limit' | 'prioritat' | 'creat_el',
  ) {
    return this.tasquesService.llistarMeves(req.user.id, {
      estat,
      modulId: modulId ? Number(modulId) : undefined,
      prioritat,
      tipus,
      cerca,
      ordre,
    });
  }

  @Post()
  async crear(
    @Req() req: { user: { id: number } },
    @Body() dto: CrearTascaDto,
  ) {
    return this.tasquesService.crear(req.user.id, dto);
  }

  @Patch(':id')
  async actualitzar(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: { user: { id: number } },
    @Body() dto: ActualitzarTascaDto,
  ) {
    return this.tasquesService.actualitzar(id, req.user.id, dto);
  }

  @Patch(':id/estat')
  async canviarEstat(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: { user: { id: number } },
    @Body('estat') estat: TascaEstat,
  ) {
    return this.tasquesService.canviarEstat(id, req.user.id, estat);
  }

  @Patch(':id/progres')
  async progres(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: { user: { id: number } },
    @Body('percentatge') percentatge: number,
  ) {
    return this.tasquesService.actualitzarProgres(id, req.user.id, percentatge);
  }

  @Patch(':id/checklist')
  async checklist(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: { user: { id: number } },
    @Body('checklist') checklist: ChecklistItem[],
  ) {
    return this.tasquesService.actualitzarChecklist(
      id,
      req.user.id,
      checklist,
    );
  }

  @Post(':id/duplicar')
  async duplicar(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: { user: { id: number } },
  ) {
    return this.tasquesService.duplicar(id, req.user.id);
  }

  @Delete(':id')
  async eliminar(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: { user: { id: number } },
  ) {
    return this.tasquesService.eliminar(id, req.user.id);
  }
}
