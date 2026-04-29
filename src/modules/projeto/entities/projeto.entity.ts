import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("projetos")
export class Projeto {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column({ nullable: true })
  descricao: string;

  @Column({ type: 'date' })
  dataInicio: Date;

  @Column({ type: 'date' })
  dataFim: Date;

  @Column({ type: 'uuid' })
  idCriador: string;
}