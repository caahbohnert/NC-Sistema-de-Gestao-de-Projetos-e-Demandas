import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Projeto } from "./entities/projeto.entity";
import { Repository } from "typeorm";
import { CriarProjetoDto } from "./dtos/cirar-projeto.dto";
import { AtualizarProjetoDto } from "./dtos/atualizar-projeto.dto";


@Injectable()
export class ProjetoService {
    constructor(
        @InjectRepository(Projeto)
        private readonly projetoRepository: Repository<Projeto>,
    ) {}

    async criarProjeto(dto: CriarProjetoDto, idCriador: string) {
        const projeto =  this.projetoRepository.create({
            ...dto,
            idCriador
        });
        return this.projetoRepository.save(projeto);
    }

    async atualizarProjeto(id: string, dto: AtualizarProjetoDto, idCriador: string): Promise<Projeto> {
        const projeto = await this.buscarPorId(id);

        if (projeto.idCriador != idCriador) {
            throw new ForbiddenException('Apenas o criador pode editar este projeto.');
        }

        Object.assign(projeto, dto);
        return this.projetoRepository.save(projeto);
    }

    async listarProjetos(idCriador: string): Promise<Projeto[]> {
        return this.projetoRepository.find({ where: { idCriador } });
    }

    async buscarPorId(id: string): Promise<Projeto> {
        const projeto = await this.projetoRepository.findOne( { where: { id } } );

        if (!projeto) {
            throw new NotFoundException("Projeto não encontrado");
        }

        return projeto;
    }
}