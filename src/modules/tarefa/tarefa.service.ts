import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Tarefa } from "./entities/tarefa.entity";
import { Repository } from "typeorm";
import { CriarTarefaDto } from "./dtos/criar-tarefa.dto";
import { AtualizarTarefaDto } from "./dtos/atualizar-tarefa.dto";
import { ProjetoService } from "../projeto/projeto.service";
import { UsuarioService } from "../usuario/usuario.service";

type TarefaComResponsavel = Tarefa & { nomeResponsavel?: string };

@Injectable()
export class TarefaService {
  constructor(
    @InjectRepository(Tarefa)
    private readonly tarefaRepository: Repository<Tarefa>,
    private readonly projetoService: ProjetoService,
    private readonly usuarioService: UsuarioService,
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

  private async preencherNomeResponsavel(tarefas: Tarefa[]): Promise<TarefaComResponsavel[]> {
    const idsResponsavel = tarefas
      .filter((t) => !!t.idResponsavel)
      .map((t) => t.idResponsavel)
      .filter((value, index, self) => self.indexOf(value) === index);

    if (idsResponsavel.length === 0) {
      return tarefas;
    }

    const usuarios = await this.usuarioService.listarUsuarios();
    const mapaResponsaveis = new Map(
      usuarios
        .filter((u) => idsResponsavel.includes(u.id))
        .map((u) => [u.id, u.nome]),
    );

    return tarefas.map((t) => ({
      ...t,
      nomeResponsavel: t.idResponsavel ? mapaResponsaveis.get(t.idResponsavel) : undefined,
    }));
  }

  async listarTarefasEmProjetos(idProjeto: string, idUsuario: string): Promise<TarefaComResponsavel[]> {
    const projeto = await this.projetoService.buscarPorId(idProjeto);

    const query = this.tarefaRepository
      .createQueryBuilder('tarefa')
      .where('tarefa.idProjeto = :idProjeto', { idProjeto })
      .orderBy('tarefa.dataCriacao', 'DESC');

    if (projeto.idCriador !== idUsuario) {
      query.andWhere('tarefa.idResponsavel = :idUsuario', { idUsuario });
    }

    const tarefas = await query.getMany();
    return this.preencherNomeResponsavel(tarefas);
  }

  async listarTarefasPorResponsavel(idResponsavel: string): Promise<TarefaComResponsavel[]> {
    const tarefas = await this.tarefaRepository.find({ where: { idResponsavel } });
    return this.preencherNomeResponsavel(tarefas);
  }
}
