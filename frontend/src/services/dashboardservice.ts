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


export const tarefaService = {
  listarPorProjeto: (idProjeto: string): Promise<Tarefa[]> =>
    api
      .get<Tarefa[]>(`/tarefas/projeto/${idProjeto}`)
      .then((r) => r.data),

  criar: (dto: {
    titulo: string;
    descricao?: string;
    status: Status;
    prioridade?: string;
    idProjeto: string;
  }): Promise<Tarefa> =>
    api.post<Tarefa>("/tarefas", dto).then((r) => r.data),

  atualizar: (
    id: string,
    dto: { titulo?: string; descricao?: string; status?: Status; prioridade?: string }
  ): Promise<Tarefa> =>
    api.put<Tarefa>(`/tarefas/${id}`, dto).then((r) => r.data),
};