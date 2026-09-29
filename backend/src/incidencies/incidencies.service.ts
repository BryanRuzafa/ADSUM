import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Incidencia, EstatIncidencia, CategoriaIncidencia, PrioritatIncidencia } from '../entities/incidencia.entity';

@Injectable()
export class IncidenciesService {
  constructor(
    @InjectRepository(Incidencia)
    private readonly incidenciaRepo: Repository<Incidencia>,
  ) {}

  // Desa una nova incidència a la base de dades rebuda des del formulari de l'estudiant
  async crearIncidencia(
    dades: { aula: string; categoria: CategoriaIncidencia; descripcio: string; prioritat?: PrioritatIncidencia },
    alumneId: number,
  ): Promise<Incidencia> {
    const novaIncidencia = this.incidenciaRepo.create({
      aula: dades.aula,
      categoria: dades.categoria,
      descripcio: dades.descripcio,
      prioritat: dades.prioritat || PrioritatIncidencia.MITJANA,
      alumneId: alumneId,
      estat: EstatIncidencia.PENDENT, // Per defecte l'estat inicial és pendent
    });

    return await this.incidenciaRepo.save(novaIncidencia);
  }

  // Llista totes les incidències reportades per un alumne en concret
  async obtenirIncidenciesAlumne(alumneId: number): Promise<Incidencia[]> {
    return await this.incidenciaRepo.find({
      where: { alumneId },
      order: { dataCreacio: 'DESC' },
    });
  }

  // Llista totes les incidències registrades per a l'administració escolar
  async obtenirTotesLesIncidencies(): Promise<Incidencia[]> {
    return await this.incidenciaRepo.find({
      relations: ['alumne'],
      order: { dataCreacio: 'DESC' },
    });
  }

  // Actualitza l'estat d'una incidència existent (ex: pendent -> en procés -> resolta)
  async actualitzarEstatIncidencia(
    incidenciaId: number,
    nouEstat: EstatIncidencia,
  ): Promise<Incidencia> {
    const incidencia = await this.incidenciaRepo.findOne({
      where: { id: incidenciaId },
    });

    if (!incidencia) {
      throw new NotFoundException('Incidència no trobada');
    }

    incidencia.estat = nouEstat;
    return await this.incidenciaRepo.save(incidencia);
  }
}
