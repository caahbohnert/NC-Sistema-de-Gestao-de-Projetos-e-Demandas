import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsUUID,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { StatusTarefa } from '../enum/status-tarefa';
import { PrioridadeTarefa } from '../enum/prioridade-tarefa';

export class AtualizarTarefaDto {
  @IsString()
  @IsNotEmpty({ message: 'O título é obrigatório.' })
  @MaxLength(255)
  titulo: string;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsEnum(StatusTarefa, { message: 'Status inválido.' })
  @IsOptional()
  status?: StatusTarefa;

  @IsEnum(PrioridadeTarefa, { message: 'Prioridade inválida.' })
  @IsOptional()
  prioridade?: PrioridadeTarefa;

  @IsDateString()
  @IsOptional()
  dataLimite?: string;

  @IsUUID()
  @IsNotEmpty({ message: 'O id do projeto é obrigatório.' })
  idProjeto: string;

  @IsUUID()
  @IsOptional()
  idResponsavel?: string;

  @IsString()
  @IsOptional()
  linkMr?: string;
}