import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Tarefa } from "./entities/tarefa.entity";
import { Repository } from "typeorm";
import { CriarTarefaDto } from "./dtos/criar-tarefa.dto";
import { AtualizarTarefaDto } from "./dtos/atualizar-tarefa.dto";
import { ProjetoService } from "../projeto/projeto.service";

@Injectable()
export class TarefaService {
  constructor(
    @InjectRepository(Tarefa)
    private readonly tarefaRepository: Repository<Tarefa>,
    private readonly projetoService: ProjetoService,
  ) {}

  async criarTarefa(dto: CriarTarefaDto): Promise<Tarefa> {
    await this.projetoService.buscarPorId(dto.idProjeto);

    const tarefa = this.tarefaRepository.create({ ...dto });
    return this.tarefaRepository.save(tarefa);
  }

  async atualizarTarefa(id: string, dto: AtualizarTarefaDto): Promise<Tarefa> {
    const tarefa = await this.tarefaRepository.findOne({ where: { id } });

    if (!tarefa) {
      throw new NotFoundException(`Tarefa com id "${id}" não encontrada.`);
    }

    Object.assign(tarefa, dto);
    return this.tarefaRepository.save(tarefa);
  }

  async listarTarefasEmProjetos(idProjeto: string): Promise<Tarefa[]> {
    return this.tarefaRepository
      .createQueryBuilder('tarefa')
      .where('tarefa.idProjeto = :idProjeto', { idProjeto })
      .orderBy('tarefa.dataCriacao', 'DESC')
      .getMany();
  }

  async listarTarefasPorResponsavel(idResponsavel: string): Promise<Tarefa[]> {
    return this.tarefaRepository.find({ where: { idResponsavel } });
  }
}
