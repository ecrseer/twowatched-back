import { Module } from '@nestjs/common';
import { TwaroomService } from './twaroom.service';
import { TwaroomController } from './twaroom.controller';
import { Twaroom, TwaroomSchema } from './entities/twaroom.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { TwaroomGateway } from './twaroom.gateway';
import { ChooseCharacterService } from './choose-character.service';
import { MoviesModule } from '../movies/movies.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Twaroom.name, schema: TwaroomSchema }]),
    MoviesModule,
  ],
  controllers: [TwaroomController],
  providers: [TwaroomService, TwaroomGateway, ChooseCharacterService],
})
export class TwaroomModule {}
