import { Test } from '@nestjs/testing';

import { INestApplication } from '@nestjs/common';
import { Socket, io } from 'socket.io-client';
import { TwaroomGateway } from '../twaroom.gateway';
import { TwaroomService } from '../twaroom.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { TwaroomModule } from '../twaroom.module';
import { MoviesModule } from '../../movies/movies.module';
import { NotificationsModule } from '../../notifications/notifications.module';
import { AppController } from '../../app.controller';
import { AppService } from '../../app.service';
import { client_enter_roleplay_notifications_room } from './data-mocks';

async function createNestApp(): Promise<INestApplication> {
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
  return testingModule.createNestApplication();
}

describe('TwaroomGateway', () => {
  let gateway: TwaroomGateway;
  let app: INestApplication;
  let ioClient: Socket;

  beforeEach(async () => {
    // Instantiate the app

    app = await createNestApp();
    // Get the gateway instance from the app instance
    gateway = app.get<TwaroomGateway>(TwaroomGateway);
    // Create a new client that will interact with the gateway
    ioClient = io('http://localhost:3043', {
      autoConnect: false,
      transports: ['websocket', 'polling'],
    });

    app.listen(3043);
  });

  afterEach(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  it('should client_enter_roleplay_notifications_room', async () => {
    ioClient.connect();

    await new Promise<void>((resolve, reject) => {
      ioClient.emit(
        'enter_roleplay_notifications_room',
        client_enter_roleplay_notifications_room.payload,
        (rooms: string[]) => {
          if (!rooms || rooms.length < 2) {
            reject('No rooms were joined');
          }
          resolve();
        },
      );
    });

    ioClient.disconnect();
  });
});
