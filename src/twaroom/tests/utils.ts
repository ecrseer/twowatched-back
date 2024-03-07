import { Test } from '@nestjs/testing';

import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { TwaroomModule } from '../twaroom.module';
import { MoviesModule } from '../../movies/movies.module';
import { AppController } from '../../app.controller';
import { AppService } from '../../app.service';
import { NotificationsModule } from '../../notifications/notifications.module';

export async function createTestNestApp() {
  const testingModule = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot(),
      MongooseModule.forRoot(process.env.MONGOURI),
      TwaroomModule,
      MoviesModule,
      NotificationsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
  }).compile();

  return {
    nestApp: testingModule.createNestApplication(),
    module: testingModule,
  };
}
