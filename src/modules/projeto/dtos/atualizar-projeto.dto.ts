import { IsDateString, isDateString, IsOptional, IsString } from "class-validator";

export class AtualizarProjetoDto {
    @IsString()
    @IsOptional()
    nome?: string;

    @IsString()
    @IsOptional()
    descricao?: string

    @IsDateString()
    @IsOptional()
    dataInicio?: string;

    @IsDateString()
    @IsOptional()
    dataFim?: string;
}