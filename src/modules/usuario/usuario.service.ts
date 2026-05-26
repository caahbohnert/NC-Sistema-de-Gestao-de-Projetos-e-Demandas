import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { Usuario } from './entities/usuario.entity';
import { CriarUsuarioDto } from './dtos/criar-usuario.dto';
import { AtualizarUsuarioDto } from './dtos/atualizar-usuario.dto';
import { AutenticarDto } from './dtos/autenticar.dto';


@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly jwtService: JwtService,
  ) {}

  async listarUsuarios(): Promise<Pick<Usuario, 'id' | 'nome'>[]> {
    return this.usuarioRepository.find({ select: ['id', 'nome'] });
  }

  async criarUsuario(dto: CriarUsuarioDto): Promise<Omit<Usuario, 'senhaHash'>> {
    const existe = await this.usuarioRepository.findOne({
      where: { email: dto.email },
    });

    if (existe) {
      throw new ConflictException('E-mail já cadastrado.');
    }

    const senhaHash = await bcrypt.hash(dto.senha, 10);

    const usuario = this.usuarioRepository.create({
      nome: dto.nome,
      email: dto.email,
      senhaHash,
    });

    const salvo = await this.usuarioRepository.save(usuario);
    const { senhaHash: _, ...resultado } = salvo;
    return resultado;
  }

  async autenticar(dto: AutenticarDto): Promise<{ accessToken: string }> {
    const usuario = await this.usuarioRepository.findOne({
      where: { email: dto.email },
    });
    if (!usuario) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }
    const senhaValida = await bcrypt.compare(dto.senha, usuario.senhaHash);
    if (!senhaValida) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const payload = { sub: usuario.id, email: usuario.email, nome: usuario.nome };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  async atualizarCadastro(
    id: string,
    dto: AtualizarUsuarioDto,
  ): Promise<Omit<Usuario, 'senhaHash'>> {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    if (dto.nome) usuario.nome = dto.nome;
    if (dto.email) usuario.email = dto.email;
    if (dto.senha) usuario.senhaHash = await bcrypt.hash(dto.senha, 10);

    const atualizado = await this.usuarioRepository.save(usuario);
    const { senhaHash: _, ...resultado } = atualizado;
    return resultado;
  }

  async buscarPorId(id: string): Promise<Usuario | null> {
    return this.usuarioRepository.findOne({ where: { id } });
  }
}