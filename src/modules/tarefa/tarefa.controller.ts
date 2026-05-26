import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request
} from "@nestjs/common";
import { JwtAuthGuard } from "../usuario/jwt-auth.guard";
import { TarefaService } from "./tarefa.service";
import { CriarTarefaDto } from "./dtos/criar-tarefa.dto";
import { AtualizarTarefaDto } from "./dtos/atualizar-tarefa.dto";
import { Tarefa } from "./entities/tarefa.entity";

@UseGuards(JwtAuthGuard)
@Controller("tarefas")
export class TarefaController {
  constructor(private readonly tarefaService: TarefaService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  criarTarefa(@Body() dto: CriarTarefaDto): Promise<Tarefa> {
    return this.tarefaService.criarTarefa(dto);
  }

  @Put(":id")
  atualizarTarefa(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: AtualizarTarefaDto,
  ): Promise<Tarefa> {
    return this.tarefaService.atualizarTarefa(id, dto);
  }

  @Get("projeto/:idProjeto")
  listarTarefasEmProjetos(
    @Param("idProjeto", ParseUUIDPipe) idProjeto: string,
    @Request() req: any,
  ): Promise<Tarefa[]> {
    return this.tarefaService.listarTarefasEmProjetos(idProjeto, req.user.id);
  }

  @Get('minhas')
  listarMinhasTarefas(@Request() req: any): Promise<Tarefa[]> {
    return this.tarefaService.listarTarefasPorResponsavel(req.user.id);
  }
}