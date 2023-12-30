import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TwaroomService } from './twaroom.service';
import { iTwaMovie } from '../movies/entities/Tmdb';
import { iNotification } from '../notifications/entities/notification.entity';

@WebSocketGateway({ cors: true })
export class TwaroomGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  ROLEPLAY_WAIT_ROOM_PREFIX = `likes_movie_`;
  constructor(private twaroomService: TwaroomService) {}

  afterInit(server: any) {
    console.log('🚀 ~ afterInit ~ server:');
  }
  @WebSocketServer()
  server: Server;

  handleConnection(client: any, ...args: any[]) {
    console.log('connected');
  }
  handleDisconnect(client: any) {
    console.log('disconnected');
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: { abc: number },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('🚀 ~ data:', data);
    const transformed = +data.abc * 2;
    client.send({ transformed });
    const all = this.twaroomService.findAll().then((data) => {
      console.log('🚀 ~ all:', data);
    });
    // Handle received message
    // this.server.emit('message', { transformed }); // Broadcast the message to all connected clients
  }

  @SubscribeMessage('enter_room')
  client_join_room(
    @MessageBody() data: { room_id: string; sender_user_id: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('🚀 ~ join room:', data);
    client.join(data.room_id);
  }

  @SubscribeMessage('send_message')
  client_sent_message(
    @MessageBody()
    user: { room_id: string; sender_user_id: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.twaroomService.add_message(user.room_id, {
      content: user.message,
      sender_user_id: user.sender_user_id,
    });
    client.to(user.room_id).emit('append_message', user);
  }

  @SubscribeMessage('enter_roleplay_notifications_room')
  client_enter_roleplay_notifications_room(
    @MessageBody()
    dto: {
      moviesList: iTwaMovie[];
    },
    @ConnectedSocket() client: Socket,
  ) {
    for (const movie of dto?.moviesList) {
      this.enter_roleplay_room(movie, client);
    }
  }
  private enter_roleplay_room(movie: iTwaMovie, client: Socket) {
    client.join(this.get_roleplay_room(movie));
  }

  @SubscribeMessage('request_roleplay_chat')
  client_request_roleplay_chat(
    @MessageBody()
    dto: {
      priority: iTwaMovie;
      moviesList: iTwaMovie[];
    },
    @ConnectedSocket() client: Socket,
  ) {
    this.send_roleplay_room_request(dto.priority, client);
    // for (const movie of dto.moviesList) {
    //   this.send_roleplay_room_request(movie, client);
    // }
  }

  private send_roleplay_room_request(movie: iTwaMovie, client: Socket) {
    const room = this.get_roleplay_room(movie);
    const notification: iNotification = {
      title: 'Someone wants to roleplay!',
      description: `${new Date().getSeconds()} wants to roleplay ${
        movie.name || movie.title
      }!`,
      type: 'info',
    };
    client.to(room).emit('wants_movie_roleplay', notification);
  }

  private get_roleplay_room(movie: iTwaMovie) {
    const room = `${this.ROLEPLAY_WAIT_ROOM_PREFIX}${
      movie.name || movie.title
    }`;

    return room;
  }
}
