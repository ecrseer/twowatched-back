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
export class TwaroomGateway implements OnGatewayInit {
  ROLEPLAY_WAIT_ROOM_PREFIX = `likes_movie_`;
  constructor(private twaroomService: TwaroomService) {}
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
    console.log('🚀 ~ client_enter_roleplay_notifications_room:', { dto });
    for (const movie of dto?.moviesList) {
      client.join(this.get_roleplay_room(movie));
    }
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
    const notification: iNotification = {
      title: 'Someone wants to roleplay!',
      description: `${new Date().getSeconds()} wants to roleplay ${
        movie.name || movie.title
      }!`,
      type: 'info',
    };
    client.to(room).emit('receive_request_roleplay_chat', notification);
  }

  private get_roleplay_room(movie: iTwaMovie) {
    const room = `${this.ROLEPLAY_WAIT_ROOM_PREFIX}${
      movie.name || movie.title
    }`;

    return room;
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
}
