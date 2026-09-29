import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  TascaDeure,
  TascaEstat,
  ChecklistItem,
} from '../entities/tasca-deure.entity';
import { CrearTascaDto } from './dto/crear-tasca.dto';
import { ActualitzarTascaDto } from './dto/actualitzar-tasca.dto';
import { Modul } from '../entities/modul.entity';
import { Usuari } from '../entities/usuari.entity';

@Injectable()
export class TasquesService {
  constructor(
    @InjectRepository(TascaDeure)
    private readonly tascaRepo: Repository<TascaDeure>,
    @InjectRepository(Modul)
    private readonly modulRepo: Repository<Modul>,
    @InjectRepository(Usuari)
    private readonly usuariRepo: Repository<Usuari>,
  ) {}

  private async assegurarPropietari(tascaId: number, alumneId: number) {
    const tasca = await this.tascaRepo.findOne({ where: { id: tascaId } });
    if (!tasca) {
      throw new NotFoundException('Tasca no trobada');
    }
    if (tasca.alumneId !== alumneId) {
      throw new ForbiddenException('No tens permís per aquesta tasca');
    }
    return tasca;
  }

  async llistarModuls(alumneId: number) {
    const alumne = await this.usuariRepo.findOne({
      where: { id: alumneId },
      relations: ['grup'],
    });
    if (!alumne?.grup) {
      return [];
    }
    const moduls = await this.modulRepo.find({
      where: { grup_id: alumne.grup.id },
      order: { nom: 'ASC' },
    });
    return moduls.map((m) => ({
      id: m.id,
      nom: m.nom,
      codi: m.codi,
    }));
  }

  async llistarMeves(
    alumneId: number,
    filtres?: {
      estat?: TascaEstat;
      modulId?: number;
      prioritat?: string;
      tipus?: string;
      cerca?: string;
      ordre?: 'data_limit' | 'prioritat' | 'creat_el';
    },
  ) {
    const qb = this.tascaRepo
      .createQueryBuilder('t')
      .leftJoinAndSelect('t.modul', 'modul')
      .where('t.alumne_id = :alumneId', { alumneId });

    if (filtres?.estat) {
      qb.andWhere('t.estat = :estat', { estat: filtres.estat });
    }
    if (filtres?.modulId) {
      qb.andWhere('t.modul_id = :modulId', { modulId: filtres.modulId });
    }
    if (filtres?.prioritat) {
      qb.andWhere('t.prioritat = :prioritat', { prioritat: filtres.prioritat });
    }
    if (filtres?.tipus) {
      qb.andWhere('t.tipus = :tipus', { tipus: filtres.tipus });
    }
    if (filtres?.cerca) {
      qb.andWhere(
        '(t.titol LIKE :cerca OR t.descripcio LIKE :cerca OR t.modul_nom LIKE :cerca)',
        { cerca: `%${filtres.cerca}%` },
      );
    }

    const ordre = filtres?.ordre || 'data_limit';
    if (ordre === 'prioritat') {
      qb.orderBy(
        `FIELD(t.prioritat, 'urgent', 'alta', 'mitjana', 'baixa')`,
        'ASC',
      );
    } else if (ordre === 'creat_el') {
      qb.orderBy('t.creat_el', 'DESC');
    } else {
      qb.orderBy('t.data_limit', 'ASC');
    }
    qb.addOrderBy('t.ordre', 'ASC');

    return qb.getMany();
  }

  async obtenirEstadistiques(alumneId: number) {
    const ara = new Date();
    const iniciDia = new Date(ara);
    iniciDia.setHours(0, 0, 0, 0);
    const fiDia = new Date(ara);
    fiDia.setHours(23, 59, 59, 999);

    const iniciSetmana = new Date(ara);
    iniciSetmana.setDate(ara.getDate() - ara.getDay() + 1);
    iniciSetmana.setHours(0, 0, 0, 0);

    const totes = await this.tascaRepo.find({ where: { alumneId } });

    const actives = totes.filter(
      (t) =>
        t.estat === TascaEstat.PENDENT || t.estat === TascaEstat.EN_CURS,
    );

    const avui = actives.filter((t) => {
      const d = new Date(t.dataLimit);
      return d >= iniciDia && d <= fiDia;
    });

    const endarrerides = actives.filter((t) => new Date(t.dataLimit) < iniciDia);

    const completadesSetmana = totes.filter(
      (t) =>
        t.estat === TascaEstat.COMPLETADA &&
        t.dataCompletada &&
        new Date(t.dataCompletada) >= iniciSetmana,
    );

    const properes = actives
      .filter((t) => new Date(t.dataLimit) >= iniciDia)
      .sort(
        (a, b) =>
          new Date(a.dataLimit).getTime() - new Date(b.dataLimit).getTime(),
      )
      .slice(0, 5);

    const perModul: Record<string, number> = {};
    actives.forEach((t) => {
      const key = t.modulNom || t.modul?.nom || 'Sense mòdul';
      perModul[key] = (perModul[key] || 0) + 1;
    });

    const perPrioritat = {
      urgent: actives.filter((t) => t.prioritat === 'urgent').length,
      alta: actives.filter((t) => t.prioritat === 'alta').length,
      mitjana: actives.filter((t) => t.prioritat === 'mitjana').length,
      baixa: actives.filter((t) => t.prioritat === 'baixa').length,
    };

    const progresMitja =
      actives.length > 0
        ? Math.round(
            actives.reduce((s, t) => s + (t.percentatgeProgres || 0), 0) /
              actives.length,
          )
        : 0;

    return {
      total: totes.length,
      actives: actives.length,
      avui: avui.length,
      endarrerides: endarrerides.length,
      completadesSetmana: completadesSetmana.length,
      progresMitja,
      perPrioritat,
      perModul,
      properes,
    };
  }

  async crear(alumneId: number, dto: CrearTascaDto) {
    let modulNom = dto.modulNom ?? null;
    if (dto.modulId) {
      const modul = await this.modulRepo.findOne({
        where: { id: dto.modulId },
      });
      if (modul) modulNom = modul.nom;
    }

    const maxOrdre = await this.tascaRepo
      .createQueryBuilder('t')
      .select('MAX(t.ordre)', 'max')
      .where('t.alumne_id = :alumneId', { alumneId })
      .getRawOne();

    const tasca = this.tascaRepo.create({
      alumneId,
      titol: dto.titol,
      descripcio: dto.descripcio ?? null,
      dataLimit: new Date(dto.dataLimit),
      modulId: dto.modulId ?? null,
      modulNom,
      prioritat: dto.prioritat,
      tipus: dto.tipus,
      estat: dto.estat ?? TascaEstat.PENDENT,
      etiquetes: dto.etiquetes ?? [],
      checklist: dto.checklist ?? [],
      enllac: dto.enllac ?? null,
      tempsEstimatMinuts: dto.tempsEstimatMinuts ?? null,
      percentatgeProgres: dto.percentatgeProgres ?? 0,
      recordatori: dto.recordatori ?? false,
      dataRecordatori: dto.dataRecordatori
        ? new Date(dto.dataRecordatori)
        : null,
      ordre: (maxOrdre?.max ?? 0) + 1,
    });

    return this.tascaRepo.save(tasca);
  }

  async actualitzar(
    tascaId: number,
    alumneId: number,
    dto: ActualitzarTascaDto,
  ) {
    const tasca = await this.assegurarPropietari(tascaId, alumneId);

    if (dto.modulId !== undefined) {
      if (dto.modulId) {
        const modul = await this.modulRepo.findOne({
          where: { id: dto.modulId },
        });
        tasca.modulNom = modul?.nom ?? dto.modulNom ?? null;
        tasca.modulId = dto.modulId;
      } else {
        tasca.modulId = null;
        tasca.modulNom = dto.modulNom ?? null;
      }
    } else if (dto.modulNom !== undefined) {
      tasca.modulNom = dto.modulNom;
    }

    if (dto.titol !== undefined) tasca.titol = dto.titol;
    if (dto.descripcio !== undefined) tasca.descripcio = dto.descripcio;
    if (dto.dataLimit !== undefined)
      tasca.dataLimit = new Date(dto.dataLimit);
    if (dto.prioritat !== undefined) tasca.prioritat = dto.prioritat;
    if (dto.tipus !== undefined) tasca.tipus = dto.tipus;
    if (dto.etiquetes !== undefined) tasca.etiquetes = dto.etiquetes;
    if (dto.checklist !== undefined) tasca.checklist = dto.checklist;
    if (dto.enllac !== undefined) tasca.enllac = dto.enllac;
    if (dto.tempsEstimatMinuts !== undefined)
      tasca.tempsEstimatMinuts = dto.tempsEstimatMinuts;
    if (dto.percentatgeProgres !== undefined)
      tasca.percentatgeProgres = dto.percentatgeProgres;
    if (dto.recordatori !== undefined) tasca.recordatori = dto.recordatori;
    if (dto.dataRecordatori !== undefined) {
      tasca.dataRecordatori = dto.dataRecordatori
        ? new Date(dto.dataRecordatori)
        : null;
    }

    if (dto.estat !== undefined) {
      tasca.estat = dto.estat;
      if (dto.estat === TascaEstat.COMPLETADA) {
        tasca.dataCompletada = new Date();
        tasca.percentatgeProgres = 100;
      } else {
        tasca.dataCompletada = null;
      }
    }

    return this.tascaRepo.save(tasca);
  }

  async canviarEstat(
    tascaId: number,
    alumneId: number,
    estat: TascaEstat,
  ) {
    return this.actualitzar(tascaId, alumneId, { estat });
  }

  async actualitzarProgres(
    tascaId: number,
    alumneId: number,
    percentatge: number,
  ) {
    const tasca = await this.assegurarPropietari(tascaId, alumneId);
    tasca.percentatgeProgres = Math.min(100, Math.max(0, Math.round(percentatge)));
    if (tasca.percentatgeProgres >= 100) {
      tasca.percentatgeProgres = 100;
      tasca.estat = TascaEstat.COMPLETADA;
      tasca.dataCompletada = new Date();
    } else if (tasca.estat === TascaEstat.COMPLETADA) {
      tasca.estat = TascaEstat.EN_CURS;
      tasca.dataCompletada = null;
    } else if (
      tasca.percentatgeProgres > 0 &&
      tasca.estat === TascaEstat.PENDENT
    ) {
      tasca.estat = TascaEstat.EN_CURS;
    }
    return this.tascaRepo.save(tasca);
  }

  async actualitzarChecklist(
    tascaId: number,
    alumneId: number,
    checklist: ChecklistItem[],
  ) {
    const tasca = await this.assegurarPropietari(tascaId, alumneId);
    tasca.checklist = checklist;
    if (checklist.length > 0) {
      const fets = checklist.filter((c) => c.fet).length;
      tasca.percentatgeProgres = Math.round((fets / checklist.length) * 100);
      if (tasca.percentatgeProgres === 100) {
        tasca.estat = TascaEstat.COMPLETADA;
        tasca.dataCompletada = new Date();
      } else if (tasca.percentatgeProgres > 0) {
        tasca.estat = TascaEstat.EN_CURS;
      }
    }
    return this.tascaRepo.save(tasca);
  }

  async duplicar(tascaId: number, alumneId: number) {
    const original = await this.assegurarPropietari(tascaId, alumneId);
    const copia = this.tascaRepo.create({
      alumneId: original.alumneId,
      modulId: original.modulId,
      modulNom: original.modulNom,
      titol: `${original.titol} (còpia)`,
      descripcio: original.descripcio,
      dataLimit: original.dataLimit,
      prioritat: original.prioritat,
      tipus: original.tipus,
      estat: TascaEstat.PENDENT,
      etiquetes: original.etiquetes ? [...original.etiquetes] : [],
      checklist:
        original.checklist?.map((c) => ({ ...c, fet: false })) ?? [],
      enllac: original.enllac,
      tempsEstimatMinuts: original.tempsEstimatMinuts,
      percentatgeProgres: 0,
      recordatori: original.recordatori,
      dataRecordatori: original.dataRecordatori,
      ordre: original.ordre + 1,
    });
    return this.tascaRepo.save(copia);
  }

  async eliminar(tascaId: number, alumneId: number) {
    const tasca = await this.assegurarPropietari(tascaId, alumneId);
    await this.tascaRepo.remove(tasca);
    return { missatge: 'Tasca eliminada' };
  }
}
