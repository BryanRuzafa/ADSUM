import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuari } from '../entities/usuari.entity';
import { Assistencia, AssistenciaEstat } from '../entities/assistencia.entity';
import { Nota } from '../entities/nota.entity';
import { Sessio } from '../entities/sessio.entity';

@Injectable()
export class FamiliesService {
  constructor(
    @InjectRepository(Usuari) private readonly usuariRepo: Repository<Usuari>,
    @InjectRepository(Assistencia)
    private readonly assistenciaRepo: Repository<Assistencia>,
    @InjectRepository(Nota) private readonly notaRepo: Repository<Nota>,
    @InjectRepository(Sessio) private readonly sessioRepo: Repository<Sessio>,
  ) {}

  async obtenirFills(tutorId: number): Promise<Usuari[]> {
    const tutor = await this.usuariRepo.findOne({
      where: { id: tutorId },
      relations: ['fills', 'fills.grup'],
    });

    if (!tutor) {
      throw new NotFoundException('Tutor no trobat');
    }

    return tutor.fills || [];
  }

  async obtenirSeguimentAvui(alumneId: number): Promise<any[]> {
    const assistencies = await this.assistenciaRepo.find({
      where: {
        alumne: { id: alumneId },
      },
      relations: ['modul'],
      order: { dataRegistre: 'DESC' },
      take: 5,
    });

    if (assistencies.length === 0) {
      // Retornem un timeline mock en cas que no tingui assistències registrades
      return [
        {
          id: 1,
          subject: 'Programació Web',
          time: '08:02h',
          location: 'Aula 202',
          status: 'Entrada Validada (QR)',
          icon: 'check',
          active: true,
        },
        {
          id: 2,
          subject: 'Bases de Dades',
          time: '10:00h',
          location: 'Laboratori 1',
          status: 'Programada',
          icon: 'clock',
          active: false,
        },
        {
          id: 3,
          subject: "Disseny d'Interfícies",
          time: '12:00h',
          location: 'Aula 204',
          status: 'Programada',
          icon: 'clock',
          active: false,
        },
      ];
    }

    return assistencies.map((a) => {
      let statusText = 'Entrada Validada';
      let iconName = 'check';
      let isActive = false;

      if (a.estat === AssistenciaEstat.PRESENT) {
        statusText = 'Entrada Validada (QR)';
        iconName = 'check';
        isActive = true;
      } else if (a.estat === AssistenciaEstat.RETARD) {
        statusText = 'Retard';
        iconName = 'clock';
        isActive = true;
      } else if (a.estat === AssistenciaEstat.ABSENT) {
        statusText = "Falta d'Assistència";
        iconName = 'close';
        isActive = false;
      }

      return {
        id: a.id,
        subject: a.modul?.nom || 'Mòdul acadèmic',
        time: a.dataRegistre
          ? new Date(a.dataRegistre).toLocaleTimeString('ca-ES', {
              hour: '2-digit',
              minute: '2-digit',
            }) + 'h'
          : '08:00h',
        location: 'Aula Base',
        status: statusText,
        icon: iconName,
        active: isActive,
      };
    });
  }

  async obtenirTasquesExamens(alumneId: number): Promise<any[]> {
    const alumne = await this.usuariRepo.findOne({
      where: { id: alumneId },
      relations: ['grup', 'grup.moduls'],
    });

    if (!alumne || !alumne.grup || !alumne.grup.moduls) {
      return [
        {
          id: 1,
          title: 'Examen Unitat 4: APIs',
          date: 'Dijous 28/05',
          subject: 'M03',
        },
        {
          id: 2,
          title: 'Lliurament Projecte Vue',
          date: 'Dilluns 01/06',
          subject: 'M07',
        },
      ];
    }

    const moduls = alumne.grup.moduls;
    const tasques: any[] = [];

    moduls.forEach((m, index) => {
      tasques.push({
        id: index * 2 + 1,
        title: `Examen Unitat: ${m.nom}`,
        date: 'Dijous 28/05',
        subject: m.codi || 'Mòdul',
      });
      tasques.push({
        id: index * 2 + 2,
        title: `Lliurament Pràctica obligatòria`,
        date: 'Dilluns 01/06',
        subject: m.codi || 'Mòdul',
      });
    });

    return tasques.slice(0, 4);
  }

  async obtenirStatsAlumne(alumneId: number): Promise<any> {
    const total = await this.assistenciaRepo.count({
      where: { alumne: { id: alumneId } },
    });
    const absences = await this.assistenciaRepo.count({
      where: { alumne: { id: alumneId }, estat: AssistenciaEstat.ABSENT },
    });

    const ratio =
      total > 0 ? Math.round(((total - absences) / total) * 100) : 96;

    return {
      faltes: absences,
      assistencia: ratio,
    };
  }

  async obtenirProfessorsAlumne(alumneId: number): Promise<any[]> {
    const alumne = await this.usuariRepo.findOne({
      where: { id: alumneId },
      relations: ['grup', 'grup.moduls', 'grup.moduls.professor'],
    });

    if (!alumne || !alumne.grup || !alumne.grup.moduls) {
      return [
        {
          nom: 'Joan',
          cognom: 'Font',
          email: 'joan@adsum.cat',
          role: 'Tutor i Professor M03',
        },
        {
          nom: 'Marta',
          cognom: 'Vila',
          email: 'marta@adsum.cat',
          role: 'Professora M07',
        },
      ];
    }

    const professorsMap = new Map<number, any>();
    alumne.grup.moduls.forEach((m) => {
      if (m.professor) {
        professorsMap.set(m.professor.id, {
          nom: m.professor.nom,
          cognom: m.professor.cognoms,
          email: m.professor.email,
          role: `Professor de ${m.nom}`,
        });
      }
    });

    return Array.from(professorsMap.values());
  }
}
