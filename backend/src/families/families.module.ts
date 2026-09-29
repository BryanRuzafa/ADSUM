import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FamiliesController } from './families.controller';
import { FamiliesService } from './families.service';
import { Usuari } from '../entities/usuari.entity';
import { Assistencia } from '../entities/assistencia.entity';
import { Nota } from '../entities/nota.entity';
import { Sessio } from '../entities/sessio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuari, Assistencia, Nota, Sessio])],
  controllers: [FamiliesController],
  providers: [FamiliesService],
  exports: [FamiliesService],
})
export class FamiliesModule {}
