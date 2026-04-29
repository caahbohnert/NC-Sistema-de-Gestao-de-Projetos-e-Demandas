export interface Projeto {
  id: string;
  nome: string;
  descricao?: string;
  dataInicio: string;
  dataFim: string;
}

export interface Tarefa {
  id: string;
  titulo: string;
  descricao?: string;
  status: Status;
  prioridade?: Prioridade;
  idProjeto: string;
  dataLimite?: string;
  linkMr?: string;
}

export type Status = "PENDENTE" | "EM_ANDAMENTO" | "CONCLUIDA" | "CANCELADA";
export type Prioridade = "BAIXA" | "MEDIA" | "ALTA" | "CRITICA";