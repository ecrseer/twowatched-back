import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicacaoService } from './publicacao.service';
import { PublicacaoController } from './publicacao.controller';
import { Publicacao } from './entities/publicacao.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Publicacao])],
  controllers: [PublicacaoController],
  providers: [PublicacaoService],
})
export class PublicacaoModule {}
