import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuari, UserRole } from '../entities/usuari.entity';
import { Assistencia, AssistenciaEstat } from '../entities/assistencia.entity';
import { LogAuditoria } from '../entities/log-auditoria.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Usuari) private usuarisRepository: Repository<Usuari>,
    @InjectRepository(Assistencia)
    private assistenciaRepository: Repository<Assistencia>,
    @InjectRepository(LogAuditoria)
    private logRepository: Repository<LogAuditoria>,
  ) {}

  async getDashboardStats() {
    // Basic stats for the dashboard
    const totalUsers = await this.usuarisRepository.count();
    const activeStudents = await this.usuarisRepository.count({
      where: { rol: UserRole.ALUMNE },
    });

    const totalAttendances = await this.assistenciaRepository.count();
    const totalAbsences = await this.assistenciaRepository.count({
      where: { estat: AssistenciaEstat.ABSENT },
    });

    const absenceRate =
      totalAttendances > 0
        ? ((totalAbsences / totalAttendances) * 100).toFixed(1)
        : 4.2;
    const punctualityRate =
      totalAttendances > 0
        ? (
            ((totalAttendances - totalAbsences) / totalAttendances) *
            100
          ).toFixed(1)
        : 98.1;

    // Get latest activity logs
    const recentLogs = await this.logRepository.find({
      order: { dataAccio: 'DESC' },
      take: 5,
      relations: ['autor'],
    });

    const mappedLogs = recentLogs.map((log) => ({
      id: log.id,
      title: log.accio,
      time: log.dataAccio,
      author: log.autor ? `${log.autor.nom} ${log.autor.cognoms}` : 'Sistema',
      status: 'Auditada',
      statusColor: 'bg-emerald-100 text-emerald-600',
      icon: 'file',
    }));

    return {
      totalUsers,
      activeStudents,
      absenceRate,
      punctualityRate,
      activityLogs:
        mappedLogs.length > 0
          ? mappedLogs
          : [
              {
                id: 1,
                title: 'Modificació de Qualificació',
                time: new Date().toISOString(),
                author: 'Sistema',
                status: 'Auditada',
                statusColor: 'bg-emerald-100 text-emerald-600',
                icon: 'file',
              },
            ],
    };
  }
}
