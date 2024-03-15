import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TwaroomService } from './twaroom.service';
import { iTwaMovie } from '../movies/entities/Tmdb';

import { iNotification, randomId } from '../utils';
import { MoviesService } from '../movies/movies.service';

@WebSocketGateway({ cors: true })
export class TwaroomGateway implements OnGatewayInit, OnGatewayDisconnect {
  ROLEPLAY_WAIT_ROOM_PREFIX = `likes_movie_`;
  constructor(
    private readonly twaroomService: TwaroomService,
    private readonly moviesService: MoviesService,
  ) {}
  handleDisconnect(client: any) {
    if (process.env.IS_TESTING) return;
    console.log('handleDisconnect:', client?.rooms);
  }
  @WebSocketServer()
  server: Server;

  afterInit(server: any) {
    // console.log('🚀 ~ afterInit ~ server:', { server });
  }

  @SubscribeMessage('enter_roleplay_notifications_room')
  client_enter_roleplay_notifications_room(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    dto: {
      moviesList: iTwaMovie[];
    },
  ) {
    for (const movie of dto.moviesList) {
      client.join(this.roleplay_room_name(movie));
    }

    return Array.from(client.rooms);
  }

  private roleplay_room_name(movie: iTwaMovie) {
    const room = `${this.ROLEPLAY_WAIT_ROOM_PREFIX}${
      movie.name || movie.title
    }`;

    return room;
  }
  private roleplay_room_acceptance_name(movie: iTwaMovie) {
    const room = `${this.ROLEPLAY_WAIT_ROOM_PREFIX}${
      movie.name || movie.title
    }_pool_`;

    return room;
  }

  @SubscribeMessage('enter_room')
  client_enter_room(
    @MessageBody()
    dto: {
      room_id: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(dto.room_id);
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

  private async send_roleplay_room_request(movie: iTwaMovie, client: Socket) {
    const room = this.roleplay_room_name(movie);
    const MOCK_USER_ID = new Date().getSeconds();
    const notification: iNotification = {
      title: 'Someone wants to roleplay!',
      description: `${MOCK_USER_ID} wants to roleplay ${
        movie.name || movie.title
      }!`,
      type: 'info',
    };

    client
      .to(room)
      .emit('receive_request_roleplay_chat', { notification, movie });
    // client.leave(all_room_polls);

    client.join(this.roleplay_room_acceptance_name(movie));
  }

  private get_client_room_pools(client: Socket) {
    return Array.from(client.rooms).filter((room) => /_pool_/gi.test(room));
  }

  @SubscribeMessage('accept_roleplay_room_request')
  public async client_accept_roleplay_room_request(
    @MessageBody() movie: iTwaMovie,
    @ConnectedSocket()
    client: Socket,
  ) {
    console.log('~☠️ ~ client_accept_roleplay_room_request ~ movie:', movie);
    const acceptance_room = this.roleplay_room_acceptance_name(movie);
    client.join(acceptance_room);
    const movie_in_db = await this.moviesService.get_tmdb_movie_by_name(
      movie.title,
    );
    console.log('~☠️ ~ TwaroomGateway ~ movie_in_db:', movie_in_db);
    const { room } = await this.twaroomService.create();
    client.in(acceptance_room).emit('accepted_roleplay_enter_room', room);
    client.emit('accepted_roleplay_enter_room', room);
  }

  @SubscribeMessage('send_message')
  client_sent_message(
    @MessageBody()
    user: { room_id: string; sender_user_id: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.twaroomService.add_message(user.room_id, {
      content: user.content,
      sender_user_id: user.sender_user_id,
    });
    client.to(user.room_id).emit('append_message', user);
  }
}
