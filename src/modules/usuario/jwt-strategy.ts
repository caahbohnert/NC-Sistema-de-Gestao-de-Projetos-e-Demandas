import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsuarioService } from './usuario.service';

export interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usuarioService: UsuarioService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET ?? "chave-secreta",
    });
  }

  async validate(payload: JwtPayload) {
    const usuario = await this.usuarioService.buscarPorId(payload.sub);
    if (!usuario) throw new UnauthorizedException();
    return { id: usuario.id, email: usuario.email };
  }
}