import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TwochatGateway } from './twochat.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, TwochatGateway],
})
export class AppModule {}
