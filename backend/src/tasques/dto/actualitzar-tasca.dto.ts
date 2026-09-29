import { PartialType } from '@nestjs/mapped-types';
import { CrearTascaDto } from './crear-tasca.dto';
import { IsEnum, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { TascaEstat } from '../../entities/tasca-deure.entity';

export class ActualitzarTascaDto extends PartialType(CrearTascaDto) {
  @IsOptional()
  @IsEnum(TascaEstat)
  estat?: TascaEstat;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  percentatgeProgres?: number;
}
