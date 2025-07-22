import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TwaroomModule } from './twaroom/twaroom.module';
import { MoviesModule } from './movies/movies.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Publicacao } from './publicacao/entities/publicacao.entity';
import { PublicacaoModule } from './publicacao/publicacao.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGOURI),
    TwaroomModule,
    MoviesModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PG_HOST || 'localhost',
      port: 5432,
      username: process.env.PG_USER,
      password: process.env.PG_PASS,
      database: process.env.PG_DB,
      entities: [Publicacao],
      synchronize: true,
    }),
    PublicacaoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
