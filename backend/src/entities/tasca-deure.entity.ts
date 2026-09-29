import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Usuari } from './usuari.entity';
import { Modul } from './modul.entity';

export enum TascaPrioritat {
  BAIXA = 'baixa',
  MITJANA = 'mitjana',
  ALTA = 'alta',
  URGENT = 'urgent',
}

export enum TascaTipus {
  EXERCICI = 'exercici',
  PROJECTE = 'projecte',
  ESTUDI = 'estudi',
  EXAMEN = 'examen',
  ENTREGA = 'entrega',
  ALTRES = 'altres',
}

export enum TascaEstat {
  PENDENT = 'pendent',
  EN_CURS = 'en_curs',
  COMPLETADA = 'completada',
  CANCELADA = 'cancelada',
}

export interface ChecklistItem {
  id: string;
  text: string;
  fet: boolean;
}

@Entity('tasca_deures')
export class TascaDeure {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'alumne_id' })
  alumneId: number;

  @ManyToOne(() => Usuari, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'alumne_id' })
  alumne: Usuari;

  @Column({ name: 'modul_id', type: 'int', nullable: true })
  modulId: number | null;

  @ManyToOne(() => Modul, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'modul_id' })
  modul: Modul;

  @Column({ name: 'modul_nom', type: 'varchar', length: 120, nullable: true })
  modulNom: string | null;

  @Column({ type: 'varchar', length: 200 })
  titol: string;

  @Column({ type: 'text', nullable: true })
  descripcio: string | null;

  @Column({ name: 'data_limit', type: 'datetime' })
  dataLimit: Date;

  @Column({
    type: 'enum',
    enum: TascaPrioritat,
    default: TascaPrioritat.MITJANA,
  })
  prioritat: TascaPrioritat;

  @Column({
    type: 'enum',
    enum: TascaTipus,
    default: TascaTipus.EXERCICI,
  })
  tipus: TascaTipus;

  @Column({
    type: 'enum',
    enum: TascaEstat,
    default: TascaEstat.PENDENT,
  })
  estat: TascaEstat;

  @Column({ type: 'json', nullable: true })
  etiquetes: string[];

  @Column({ type: 'json', nullable: true })
  checklist: ChecklistItem[];

  @Column({ type: 'varchar', length: 500, nullable: true })
  enllac: string | null;

  @Column({ name: 'temps_estimat_minuts', type: 'int', nullable: true })
  tempsEstimatMinuts: number | null;

  @Column({ name: 'percentatge_progres', default: 0 })
  percentatgeProgres: number;

  @Column({ default: false })
  recordatori: boolean;

  @Column({ name: 'data_recordatori', type: 'datetime', nullable: true })
  dataRecordatori: Date | null;

  @Column({ default: 0 })
  ordre: number;

  @Column({ name: 'data_completada', type: 'datetime', nullable: true })
  dataCompletada: Date | null;

  @CreateDateColumn({ name: 'creat_el' })
  creatEl: Date;

  @UpdateDateColumn({ name: 'actualitzat_el' })
  actualitzatEl: Date;
}
