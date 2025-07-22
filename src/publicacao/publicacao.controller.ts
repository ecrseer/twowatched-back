import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PublicacaoService } from './publicacao.service';
import { Publicacao } from './entities/publicacao.entity';

@Controller('publicacoes')
export class PublicacaoController {
  constructor(private readonly service: PublicacaoService) {}

  @Post()
  create(@Body() dto: Partial<Publicacao>) {
    return this.service.create(dto);
  }

  @Get()
  obterTodos() {
    return this.service.obterTodos();
  }
}
