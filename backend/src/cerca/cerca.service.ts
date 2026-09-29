/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Usuari } from '../entities/usuari.entity';
import { Modul } from '../entities/modul.entity';

@Injectable()
export class CercaService {
  constructor(
    @InjectRepository(Usuari)
    private readonly usuariRepo: Repository<Usuari>,
    @InjectRepository(Modul)
    private readonly modulRepo: Repository<Modul>,
  ) {}

  async globalSearch(q: string): Promise<any[]> {
    if (!q || q.trim() === '') return [];

    const term = `%${q}%`;
    const results: any[] = [];

    // Search Users
    const usuaris = await this.usuariRepo.find({
      where: [
        { nom: Like(term) },
        { cognoms: Like(term) },
        { email: Like(term) },
      ],
      take: 5,
    });

    usuaris.forEach((u) => {
      let subtitle = 'Alumne';
      if (u.rol === 'professor') subtitle = 'Professor / Docent';
      if (u.rol === 'admin') subtitle = 'Administrador';

      results.push({
        id: `usuari-${u.id}`,
        title: `${u.nom} ${u.cognoms || ''}`,
        subtitle: `${subtitle} · ${u.email}`,
        type: 'usuari',
        payload: { userId: u.id, rol: u.rol },
      });
    });

    // Search Modules
    const moduls = await this.modulRepo.find({
      where: [{ nom: Like(term) }, { codi: Like(term) }],
      take: 5,
    });

    moduls.forEach((m) => {
      results.push({
        id: `modul-${m.id}`,
        title: `${m.codi} - ${m.nom}`,
        subtitle: `Mòdul Acadèmic`,
        type: 'modul',
        payload: { modulId: m.id },
      });
    });

    // Search static Navigation links
    const navs = [
      {
        id: 'nav-home',
        title: 'Inici / Dashboard',
        subtitle: 'Anar al panell principal',
        type: 'nav',
        payload: { view: 'home' },
      },
      {
        id: 'nav-calendar',
        title: 'Calendari Escolar',
        subtitle: 'Veure festius i exàmens',
        type: 'nav',
        payload: { view: 'calendar' },
      },
      {
        id: 'nav-schedule',
        title: 'Horari de Classes',
        subtitle: 'Sessions i aules de la setmana',
        type: 'nav',
        payload: { view: 'schedule' },
      },
      {
        id: 'nav-justifications',
        title: 'Tràmits i Faltes',
        subtitle: 'Justificar absències',
        type: 'nav',
        payload: { view: 'justifications' },
      },
      {
        id: 'nav-chat',
        title: 'Xat de Comunicació',
        subtitle: 'Enviar missatges a docents o alumnes',
        type: 'nav',
        payload: { view: 'chat' },
      },
    ];

    const matchingNavs = navs.filter(
      (n) =>
        n.title.toLowerCase().includes(q.toLowerCase()) ||
        n.subtitle.toLowerCase().includes(q.toLowerCase()),
    );
    results.push(...matchingNavs);

    return results;
  }
}
