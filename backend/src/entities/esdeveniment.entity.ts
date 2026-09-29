import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('esdeveniments')
export class Esdeveniment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  titol: string;

  @Column({ length: 50 })
  tipus: string;

  @Column({ length: 100 })
  data: string;

  @Column({ type: 'int' })
  dia: number;

  @CreateDateColumn({ name: 'data_creacio' })
  dataCreacio: Date;
}
