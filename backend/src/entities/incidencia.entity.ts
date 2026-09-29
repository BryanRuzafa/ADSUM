import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Usuari } from './usuari.entity';

// Enums per a les categories de les incidències de l'aula
export enum CategoriaIncidencia {
  ORDINADOR = 'ordinador',
  PROJECTOR = 'projector',
  CLIMATITZACIO = 'climatitzacio',
  INFRAESTRUCTURA = 'infraestructura',
  ALTRES = 'altres',
}

// Enums per a l'estat actual de la queixa o report
export enum EstatIncidencia {
  PENDENT = 'pendent',
  EN_PROCES = 'en_proces',
  RESOLTA = 'resolta',
}

// Enums per a la prioritat o gravetat del report
export enum PrioritatIncidencia {
  BAIXA = 'baixa',
  MITJANA = 'mitjana',
  ALTA = 'alta',
}

@Entity('incidencies')
export class Incidencia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'alumne_id' })
  alumneId: number;

  // Relació de molts a un amb l'usuari que fa el report
  @ManyToOne(() => Usuari, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'alumne_id' })
  alumne: Usuari;

  @Column({ length: 100 })
  aula: string;

  @Column({
    type: 'enum',
    enum: CategoriaIncidencia,
    default: CategoriaIncidencia.ALTRES,
  })
  categoria: CategoriaIncidencia;

  @Column({ type: 'text' })
  descripcio: string;

  @Column({
    type: 'enum',
    enum: EstatIncidencia,
    default: EstatIncidencia.PENDENT,
  })
  estat: EstatIncidencia;

  @Column({
    type: 'enum',
    enum: PrioritatIncidencia,
    default: PrioritatIncidencia.MITJANA,
  })
  prioritat: PrioritatIncidencia;

  @CreateDateColumn({ name: 'data_creacio' })
  dataCreacio: Date;
}
