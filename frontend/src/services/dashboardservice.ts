import type { Projeto, Status, Tarefa } from "../types";
import { api } from "./api";


export const projetoService = {
  listar: (): Promise<Projeto[]> =>
    api.get<Projeto[]>("/projetos").then((r) => r.data),

  criar: (dto: {
    nome: string;
    descricao?: string;
    dataInicio: string;
    dataFim: string;
  }): Promise<Projeto> =>
    api.post<Projeto>("/projetos", dto).then((r) => r.data),

  atualizar: (
    id: string,
    dto: { nome?: string; descricao?: string }
  ): Promise<Projeto> =>
    api.put<Projeto>(`/projetos/${id}`, dto).then((r) => r.data),
};

export const usuarioService = {
  listar: (): Promise<{ id: string; nome: string }[]> =>
    api.get<{ id: string; nome: string }[]>("/usuarios").then((r) => r.data),
};

async function carregarUsuarios(): Promise<{ id: string; nome: string }[]> {
  return usuarioService.listar();
}

function preencherNomeResponsavel(tarefa: Tarefa, usuarios: { id: string; nome: string }[]): Tarefa {
  if (!tarefa.idResponsavel) {
    return tarefa;
  }
  return {
    ...tarefa,
    nomeResponsavel: usuarios.find((u) => u.id === tarefa.idResponsavel)?.nome,
  };
}

export const tarefaService = {
  listarPorProjeto: async (idProjeto: string): Promise<Tarefa[]> => {
    const [tarefas, usuarios] = await Promise.all([
      api.get<Tarefa[]>(`/tarefas/projeto/${idProjeto}`).then((r) => r.data),
      carregarUsuarios(),
    ]);

    return tarefas.map((t) => preencherNomeResponsavel(t, usuarios));
  },

  criar: async (dto: {
    titulo: string;
    descricao?: string;
    status: Status;
    prioridade?: string;
    idProjeto: string;
    idResponsavel?: string;
    linkMr?: string;
    dataLimite?: string;
  }): Promise<Tarefa> => {
    const response = await api.post<Tarefa>("/tarefas", dto);
    const tarefa = response.data;
    if (!tarefa.idResponsavel) {
      return tarefa;
    }
    const usuarios = await carregarUsuarios();
    return preencherNomeResponsavel(tarefa, usuarios);
  },

  atualizar: async (
    id: string,
    dto: {
      titulo?: string;
      descricao?: string;
      status?: Status;
      prioridade?: string;
      idProjeto: string;
      idResponsavel?: string;
      linkMr?: string;
      dataLimite?: string;
    }
  ): Promise<Tarefa> => {
    const response = await api.put<Tarefa>(`/tarefas/${id}`, dto);
    const tarefa = response.data;
    if (!tarefa.idResponsavel) {
      return tarefa;
    }
    const usuarios = await carregarUsuarios();
    return preencherNomeResponsavel(tarefa, usuarios);
  },
};