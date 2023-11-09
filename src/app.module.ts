import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TwochatGateway } from './twochat.gateway';

import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TwaroomModule } from './twaroom/twaroom.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGOURI),
    TwaroomModule,
  ],
  controllers: [AppController],
  providers: [AppService, TwochatGateway],
})
export class AppModule {}
