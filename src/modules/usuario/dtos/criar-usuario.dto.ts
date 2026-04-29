import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';

export class CriarUsuarioDto {

  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  senha: string;
}