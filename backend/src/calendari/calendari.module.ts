import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendariController } from './calendari.controller';
import { CalendariService } from './calendari.service';
import { Esdeveniment } from '../entities/esdeveniment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Esdeveniment])],
  controllers: [CalendariController],
  providers: [CalendariService],
  exports: [CalendariService],
})
export class CalendariModule {}
