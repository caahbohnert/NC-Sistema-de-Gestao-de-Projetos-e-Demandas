import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { StatusTarefa } from "../enum/status-tarefa";
import { PrioridadeTarefa } from "../enum/prioridade-tarefa";

@Entity("tarefas")
export class Tarefa {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  titulo: string;

  @Column({ nullable: true })
  descricao: string;

  @Column({
    type: 'enum',
    enum: StatusTarefa,
    default: StatusTarefa.PENDENTE,
  })
  status: StatusTarefa;

  @Column({
    type: 'enum',
    enum: PrioridadeTarefa,
    default: PrioridadeTarefa.MEDIA,
  })
  prioridade: PrioridadeTarefa;

  @CreateDateColumn()
  dataCriacao: Date;

  @Column({ type: 'timestamp', nullable: true })
  dataLimite: Date;

  @Column({ type: 'uuid' })
  idProjeto: string;

  @Column({ type: 'uuid', nullable: true })
  idResponsavel: string;

  @Column({ nullable: true })
  linkMr: string;
}