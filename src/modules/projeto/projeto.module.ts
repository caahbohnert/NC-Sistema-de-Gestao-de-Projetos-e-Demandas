import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Projeto } from "./entities/projeto.entity";
import { ProjetoController } from "./projeto.controller";
import { ProjetoService } from "./projeto.service";

@Module({
    imports: [TypeOrmModule.forFeature([Projeto])],
    controllers: [ProjetoController],
    providers: [ProjetoService],
    exports: [ProjetoService]
})

export class ProjetoModule {}