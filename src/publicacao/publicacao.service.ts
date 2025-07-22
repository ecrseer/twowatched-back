import { Repository } from 'typeorm';
import { Publicacao } from './entities/publicacao.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PublicacaoService {
  constructor(
    @InjectRepository(Publicacao)
    private readonly publicacaoRepository: Repository<Publicacao>,
  ) {}

  onModuleInit() {
    console.log('=>(publicacao.service.ts:15) \n----\n');
  }

  async create(publicacao: Partial<Publicacao>) {
    return this.publicacaoRepository.save(publicacao);
  }

  async obterTodos() {
    const res = await this.publicacaoRepository.find({
      order: { createdAt: 'DESC' },
    });
    return res;
  }
}
