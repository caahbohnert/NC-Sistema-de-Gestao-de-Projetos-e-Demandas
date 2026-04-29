import { IsDateString, isDateString, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CriarProjetoDto {
    @IsString()
    @IsNotEmpty()
    nome: string;

    @IsString()
    @IsOptional()
    descricao?: string

    @IsDateString()
    @IsNotEmpty()
    dataInicio: string;

    @IsDateString()
    @IsNotEmpty()
    dataFim: string;
}