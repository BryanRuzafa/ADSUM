import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CercaController } from './cerca.controller';
import { CercaService } from './cerca.service';
import { Usuari } from '../entities/usuari.entity';
import { Modul } from '../entities/modul.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuari, Modul])],
  controllers: [CercaController],
  providers: [CercaService],
  exports: [CercaService],
})
export class CercaModule {}
