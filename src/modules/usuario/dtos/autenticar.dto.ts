import { IsEmail, IsString } from 'class-validator';

export class AutenticarDto {
  @IsEmail()
  email: string;

  @IsString()
  senha: string;
}