import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsArray,
  IsDateString,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import {
  TascaPrioritat,
  TascaTipus,
  TascaEstat,
} from '../../entities/tasca-deure.entity';

export class CrearTascaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  titol: string;

  @IsOptional()
  @IsString()
  descripcio?: string;

  @IsDateString()
  dataLimit: string;

  @IsOptional()
  @IsNumber()
  modulId?: number;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  modulNom?: string;

  @IsOptional()
  @IsEnum(TascaPrioritat)
  prioritat?: TascaPrioritat;

  @IsOptional()
  @IsEnum(TascaTipus)
  tipus?: TascaTipus;

  @IsOptional()
  @IsEnum(TascaEstat)
  estat?: TascaEstat;

  @IsOptional()
  @IsArray()
  etiquetes?: string[];

  @IsOptional()
  @IsArray()
  checklist?: { id: string; text: string; fet: boolean }[];

  @IsOptional()
  @IsString()
  enllac?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  tempsEstimatMinuts?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  percentatgeProgres?: number;

  @IsOptional()
  @IsBoolean()
  recordatori?: boolean;

  @IsOptional()
  @IsDateString()
  dataRecordatori?: string;
}
