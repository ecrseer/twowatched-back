import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TwaroomModule } from './twaroom/twaroom.module';
import { MoviesModule } from './movies/movies.module';
import { RoleplayNotificationModule } from './roleplay-notification/roleplay-notification.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGOURI),
    TwaroomModule,
    MoviesModule,
    RoleplayNotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
