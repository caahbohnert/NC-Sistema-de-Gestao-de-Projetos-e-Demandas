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

export const tarefaService = {
  listarPorProjeto: async (idProjeto: string): Promise<Tarefa[]> => {
    const [tarefas, usuarios] = await Promise.all([
      api.get<Tarefa[]>(`/tarefas/projeto/${idProjeto}`).then((r) => r.data),
      api.get<{ id: string; nome: string }[]>("/usuarios").then((r) => r.data),
    ]);

    return tarefas.map((t) => ({
      ...t,
      nomeResponsavel: usuarios.find((u) => u.id === t.idResponsavel)?.nome,
    }));
  },

  criar: (dto: {
    titulo: string;
    descricao?: string;
    status: Status;
    prioridade?: string;
    idProjeto: string;
    idResponsavel?: string;
    linkMr?: string;
    dataLimite?: string;
  }): Promise<Tarefa> =>
    api.post<Tarefa>("/tarefas", dto).then((r) => r.data),

  atualizar: (
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
  ): Promise<Tarefa> =>
    api.put<Tarefa>(`/tarefas/${id}`, dto).then((r) => r.data),
};