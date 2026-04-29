import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioModule } from './modules/usuario/usuario.module';
import { ProjetoModule } from './modules/projeto/projeto.module';
import { TarefaModule } from './modules/tarefa/tarefa.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'root',
      password: 'root',
      database: 'gerenciadorProjetosDemandas',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsuarioModule,
    ProjetoModule,
    TarefaModule
  ],
})
export class AppModule {}