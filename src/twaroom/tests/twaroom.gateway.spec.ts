import { Test } from '@nestjs/testing';

import { INestApplication } from '@nestjs/common';
import { Socket, io } from 'socket.io-client';
import { TwaroomGateway } from '../twaroom.gateway';
// import { TwaroomService } from '../twaroom.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { TwaroomModule } from '../twaroom.module';
import { MoviesModule } from '../../movies/movies.module';
import { NotificationsModule } from '../../notifications/notifications.module';
import { AppController } from '../../app.controller';
import { AppService } from '../../app.service';
import {
  client_enter_roleplay_notifications_room,
  mock_create_room,
} from './data-mocks';

export async function createTestNestApp(): Promise<INestApplication> {
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
  let ioClient2: Socket;

  beforeEach(async () => {
    // Instantiate the app

    app = await createTestNestApp();
    // Get the gateway instance from the app instance
    gateway = app.get<TwaroomGateway>(TwaroomGateway);
    // Create a new client that will interact with the gateway
    ioClient = io('http://localhost:3043', {
      autoConnect: false,
      transports: ['websocket', 'polling'],
    });
    ioClient2 = io('http://localhost:3043', {
      autoConnect: false,
      transports: ['websocket', 'polling'],
    });

    app.listen(3043);
  });

  afterEach(async () => {
    await app.close();
  });
  afterAll(async () => {
    ioClient.disconnect();
    ioClient2.disconnect();
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
  async function test_enter_room(client: Socket, name?: string) {
    return await new Promise<void>((resolve, reject) => {
      client.emit(
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
  }
  async function test_request_roleplay_chat() {
    return await new Promise<void>((resolve, rejects) => {
      ioClient2.on('receive_request_roleplay_chat', (notification: any) => {
        console.log('~☠️ ~ ioClient2.on ~ notification:', notification);
        resolve();
      });

      ioClient.emit('request_roleplay_chat', {
        priority:
          client_enter_roleplay_notifications_room.payload.moviesList[0],
      });

      rejects();
    });
  }

  it('should get_roleplay_room prefix', async () => {
    ioClient.connect();
    // await test_enter_room();
    const room_name = gateway['get_roleplay_room'](
      client_enter_roleplay_notifications_room.payload.moviesList[0],
    );
    expect(room_name.length).toBeGreaterThan(3);
    ioClient.disconnect();
  });

  it('should client_enter_roleplay_notifications_room', async () => {
    ioClient.connect();
    await test_enter_room(ioClient);
    ioClient.disconnect();
  });

  it('should enter room and chat', async () => {
    ioClient.connect();
    ioClient2.connect();
    await test_enter_room(ioClient, 'bob1');
    await test_enter_room(ioClient2, 'jane2');
    // await test_request_roleplay_chat();
    ioClient.disconnect();
  });
});
