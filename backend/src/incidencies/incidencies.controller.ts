import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { IncidenciesService } from './incidencies.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CategoriaIncidencia, EstatIncidencia, PrioritatIncidencia } from '../entities/incidencia.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Incidències de l\'aula')
@ApiBearerAuth('access-token')
@Controller('api/incidencies')
@UseGuards(JwtAuthGuard)
export class IncidenciesController {
  constructor(private readonly incidenciesService: IncidenciesService) {}

  // Endpoint per obrir o reportar una nova incidència a l'aula
  @Post('crear')
  async crear(
    @Req() req: any,
    @Body() dades: { aula: string; categoria: CategoriaIncidencia; descripcio: string; prioritat?: PrioritatIncidencia },
  ) {
    const alumneId = req.user.id;
    return await this.incidenciesService.crearIncidencia(dades, alumneId);
  }

  // Endpoint per llistar les incidències que ha pujat l'alumne actualment connectat
  @Get('meves')
  async llistarMeves(@Req() req: any) {
    const alumneId = req.user.id;
    return await this.incidenciesService.obtenirIncidenciesAlumne(alumneId);
  }

  // Endpoint per llistar totes les incidències registrades al centre (Només Professors o Admins)
  @Get('llistat')
  async llistarTotes(@Req() req: any) {
    const rolUsuari = req.user.rol;
    if (rolUsuari !== 'professor' && rolUsuari !== 'admin') {
      throw new ForbiddenException('No tens els permisos necessaris per veure aquesta informació');
    }
    return await this.incidenciesService.obtenirTotesLesIncidencies();
  }

  // Endpoint per canviar l'estat d'una incidència existent (Només Professors o Admins)
  @Patch('canviar-estat/:id')
  async actualitzarEstat(
    @Req() req: any,
    @Param('id') id: number,
    @Body() dades: { estat: EstatIncidencia },
  ) {
    const rolUsuari = req.user.rol;
    if (rolUsuari !== 'professor' && rolUsuari !== 'admin') {
      throw new ForbiddenException('No tens permisos per modificar l\'estat de les incidències');
    }
    return await this.incidenciesService.actualitzarEstatIncidencia(id, dades.estat);
  }
}
