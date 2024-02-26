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
export class TwaroomGateway implements OnGatewayInit, OnGatewayDisconnect {
  ROLEPLAY_WAIT_ROOM_PREFIX = `likes_movie_`;
  constructor(private twaroomService: TwaroomService) {}
  handleDisconnect(client: any) {
    console.log('🚀 ~ handleDisconnect ~ client:', client?.rooms);
  }
  @WebSocketServer()
  server: Server;

  afterInit(server: any) {
    console.log('🚀 ~ afterInit ~ server:', { server });
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
      client.join(this.get_roleplay_room(movie));
    }
    console.log('🚀 ~ client:', client.rooms);
  }

  private get_roleplay_room(movie: iTwaMovie) {
    const room = `${this.ROLEPLAY_WAIT_ROOM_PREFIX}${
      movie.name || movie.title
    }`;

    return room;
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
  }

  private send_roleplay_room_request(movie: iTwaMovie, client: Socket) {
    const room = this.get_roleplay_room(movie);
    const MOCK_USER_ID = new Date().getSeconds();
    const notification: iNotification = {
      title: 'Someone wants to roleplay!',
      description: `${MOCK_USER_ID} wants to roleplay ${
        movie.name || movie.title
      }!`,
      type: 'info',
    };
    client.to(room).emit('receive_request_roleplay_chat', notification);
  }

  @SubscribeMessage('send_message')
  client_sent_message(
    @MessageBody()
    user: { room_id: string; sender_user_id: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('🚀 ~ ent_message:', client.rooms);
    this.twaroomService.add_message(user.room_id, {
      content: user.content,
      sender_user_id: user.sender_user_id,
    });
    client.to(user.room_id).emit('append_message', user);
  }
}
