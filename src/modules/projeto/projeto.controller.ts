import { Body, Controller, Post, UseGuards, Request, Put, Param, Get } from "@nestjs/common";
import { JwtAuthGuard } from "../usuario/jwt-auth.guard";
import { ProjetoService } from "./projeto.service";
import { CriarProjetoDto } from "./dtos/cirar-projeto.dto";
import { AtualizarProjetoDto } from "./dtos/atualizar-projeto.dto";

@UseGuards(JwtAuthGuard)
@Controller('projetos')
export class ProjetoController {
    constructor(private readonly projetoService: ProjetoService) {}

    @Post()
    criarProjeto(@Body() dto: CriarProjetoDto, @Request() req: any) {
        return this.projetoService.criarProjeto(dto, req.user.id);
    }

    @Put(':id')
    atualizarProjeto(
        @Param('id') id: string,
        @Body() dto: AtualizarProjetoDto,
        @Request() req:any
    ) {
        return this.projetoService.atualizarProjeto(id, dto, req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    listarProjetos(@Request() req: any) {
        return this.projetoService.listarProjetos(req.user.id);
    }
}