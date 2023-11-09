import { Module } from '@nestjs/common';
import { TwaroomService } from './twaroom.service';
import { TwaroomController } from './twaroom.controller';
import { Twaroom, TwaroomSchema } from './entities/twaroom.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Twaroom.name, schema: TwaroomSchema }]),
  ],
  controllers: [TwaroomController],
  providers: [TwaroomService],
})
export class TwaroomModule {}
