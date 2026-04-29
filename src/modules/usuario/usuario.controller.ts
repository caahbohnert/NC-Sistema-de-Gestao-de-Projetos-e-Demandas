import {
  Controller,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CriarUsuarioDto } from './dtos/criar-usuario.dto';
import { AutenticarDto } from './dtos/autenticar.dto';
import { AtualizarUsuarioDto } from './dtos/atualizar-usuario.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}
  @Get()
  listarProjetos(@Request() req: any) {
      return this.usuarioService.listarUsuarios();
  }

  @Post()
  criarUsuario(@Body() dto: CriarUsuarioDto) {
    return this.usuarioService.criarUsuario(dto);
  }

  @Post('login')
  autenticar(@Body() dto: AutenticarDto) {
    return this.usuarioService.autenticar(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  atualizarCadastro(
    @Param('id') id: string,
    @Body() dto: AtualizarUsuarioDto,
    @Request() req: any,
  ) {
    return this.usuarioService.atualizarCadastro(id, dto);
  }
}