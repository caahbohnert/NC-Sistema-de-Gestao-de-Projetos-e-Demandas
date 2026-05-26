import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Tarefa } from "./entities/tarefa.entity";
import { TarefaService } from "./tarefa.service";
import { TarefaController } from "./tarefa.controller";
import { ProjetoModule } from "../projeto/projeto.module";
import { UsuarioModule } from "../usuario/usuario.module";


@Module({
    imports: [TypeOrmModule.forFeature([Tarefa]),
    ProjetoModule,
    UsuarioModule,
    ],
    controllers: [TarefaController],
    providers: [TarefaService],
    exports: [TarefaService]
})

export class TarefaModule {}