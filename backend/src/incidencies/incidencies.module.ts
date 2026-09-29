import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncidenciesController } from './incidencies.controller';
import { IncidenciesService } from './incidencies.service';
import { Incidencia } from '../entities/incidencia.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Incidencia])],
  controllers: [IncidenciesController],
  providers: [IncidenciesService],
  exports: [IncidenciesService],
})
export class IncidenciesModule {}
