import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasquesService } from './tasques.service';
import { TasquesController } from './tasques.controller';
import { TascaDeure } from '../entities/tasca-deure.entity';
import { Modul } from '../entities/modul.entity';
import { Usuari } from '../entities/usuari.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TascaDeure, Modul, Usuari])],
  controllers: [TasquesController],
  providers: [TasquesService],
  exports: [TasquesService],
})
export class TasquesModule {}
