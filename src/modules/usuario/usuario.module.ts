import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { Usuario } from './entities/usuario.entity';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { JwtStrategy } from './jwt-strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'chave-secreta',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [UsuarioController],
  providers: [UsuarioService, JwtStrategy],
  exports: [UsuarioService],
})
export class UsuarioModule {}