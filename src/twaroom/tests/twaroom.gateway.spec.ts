import { INestApplication } from '@nestjs/common';
import { Socket, io } from 'socket.io-client';
import { TwaroomGateway } from '../twaroom.gateway';
// import { TwaroomService } from '../twaroom.service';

import {
  client_enter_roleplay_notifications_room,
  mock_enter_roleplay_room,
} from './data-mocks';
import { createMyRealDBTestNestApp } from './utils';

describe('TwaroomGateway', () => {
  let gateway: TwaroomGateway;
  let app: INestApplication;
  let ioClient: Socket;
  let ioClient2: Socket;

  beforeEach(async () => {
    const { nestApp } = await createMyRealDBTestNestApp();
    app = nestApp;
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
    process.env.IS_TESTING = 'true';
  });

  afterEach(async () => {
    await app.close();
  });
  afterAll(async () => {
    ioClient.disconnect();
    ioClient2.disconnect();
  });

  async function test_request_roleplay_chat() {
    return await new Promise<void>((resolve, reject) => {
      ioClient2.on('receive_request_roleplay_chat', (notification: any) => {
        console.log('~☠️ ~ ioClient2.on ~ notification:', notification);
        resolve();
      });

      ioClient.emit('request_roleplay_chat', {
        priority:
          client_enter_roleplay_notifications_room.payload.moviesList[0],
      });

      reject(new Error('No response from server')); // Fix: Replace the rejection reason with an instance of the Error class.
    });
  }

  async function test_enter_room(client: Socket, name?: string) {
    return await new Promise<void>((resolve, reject) => {
      client.emit(
        'enter_roleplay_notifications_room',
        mock_enter_roleplay_room.payload,
        (rooms: string[]) => {
          if (!rooms || rooms.length < 2) {
            reject(new Error('No rooms were joined' + name));
          }
          resolve();
        },
      );
    });
  }

  it('should get_roleplay_room prefix', async () => {
    ioClient.connect();

    const room_name = gateway['roleplay_room_name'](
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
  it('should pool for roleplay group chat', async () => {
    ioClient.connect();
    await test_enter_room(ioClient, 'bob1');

    ioClient2.connect();
    await test_enter_room(ioClient2, 'jane2');

    await new Promise<void>((resolve, reject) => {
      ioClient2.on(
        'receive_request_roleplay_chat',
        (notificationAndMovie: any) => {
          if (!notificationAndMovie?.movie?.title) {
            reject(new Error('No response from server'));
          }
          resolve();
          ioClient.disconnect();
          ioClient2.disconnect();
        },
      );

      ioClient.emit('request_roleplay_chat', {
        priority:
          client_enter_roleplay_notifications_room.payload.moviesList[0],
        moviesList: client_enter_roleplay_notifications_room.payload.moviesList,
      });
    });
    // console.log('finished');
  });

  it('should enter room and chat', async () => {
    ioClient.connect();
    ioClient2.connect();
    await test_enter_room(ioClient, 'bob1');
    await test_enter_room(ioClient2, 'jane2');
    // await test_request_roleplay_chat();
    ioClient.disconnect();
    ioClient2.disconnect();
  });
});
