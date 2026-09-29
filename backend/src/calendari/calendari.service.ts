import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Esdeveniment } from '../entities/esdeveniment.entity';

@Injectable()
export class CalendariService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Esdeveniment)
    private readonly esdevenimentRepo: Repository<Esdeveniment>,
  ) {}

  async onApplicationBootstrap() {
    const count = await this.esdevenimentRepo.count();
    if (count === 0) {
      await this.esdevenimentRepo.save([
        {
          titol: 'Presentació Final ADSUM',
          data: '22 Maig',
          tipus: 'Examen',
          dia: 22,
        },
        {
          titol: 'Lliurament Memòria TR',
          data: '15 Maig',
          tipus: 'Entrega',
          dia: 15,
        },
        {
          titol: 'Festa de Graduació',
          data: '29 Maig',
          tipus: 'Festiu',
          dia: 29,
        },
      ]);
      console.log('[SEED] Calendari inicialitzat correctament.');
    }
  }

  async obtenirTots(): Promise<Esdeveniment[]> {
    return this.esdevenimentRepo.find({ order: { dia: 'ASC' } });
  }

  async crear(dades: Partial<Esdeveniment>): Promise<Esdeveniment> {
    const nou = this.esdevenimentRepo.create(dades);
    return this.esdevenimentRepo.save(nou);
  }

  async eliminar(id: number): Promise<void> {
    await this.esdevenimentRepo.delete(id);
  }
}
