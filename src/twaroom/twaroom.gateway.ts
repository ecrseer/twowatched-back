import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TwaroomService } from './twaroom.service';
import { iTwaMovie } from '../movies/entities/Tmdb';

import { iNotification } from '../utils';
import { MoviesService } from '../movies/movies.service';

@WebSocketGateway({ cors: true })
export class TwaroomGateway implements OnGatewayDisconnect {
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

  @SubscribeMessage('enter_roleplay_notifications_room')
  async client_enter_roleplay_notifications_room(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    dto: {
      moviesListIds: string[];
    },
  ) {
    console.log('=>(twaroomenter :44) dto.moviesListIds', dto.moviesListIds);
    const movieList = await this.moviesService.get_movie_by_ids(
      dto.moviesListIds,
    );

    for (const movie of movieList) {
      client.join(this.roleplay_room_name(movie));
    }

    console.log(
      '=>(er_roleplay_notifications_room.gateway.ts:87) client',
      client.rooms,
    );

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
      description: `Someone wants to roleplay ${movie.name || movie.title}!`,
      type: 'info',
    };

    client.join(room);

    console.log('=>(send_roleplay_room_request.gateway.ts:115) room', {
      room,
      rooms: client.rooms,
    });
    client
      .to(room)
      .emit('receive_request_roleplay_chat', { notification, movie });
    // client.leave(all_room_polls);
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
    const acceptance_room = this.roleplay_room_acceptance_name(movie);
    client.join(acceptance_room);

    const movie_in_db = await this.moviesService.get_tmdb_movie_by_name(
      movie.title,
    );

    const { room } = await this.twaroomService.create(movie_in_db);
    client.in(acceptance_room).emit('accepted_roleplay_enter_room', room);
    client.emit('accepted_roleplay_enter_room', room);
  }

  @SubscribeMessage('send_message')
  async client_sent_message(
    @MessageBody()
    user: { room_id: string; sender_user_id: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    const room = await this.twaroomService.add_message(user.room_id, {
      content: user.content,
      sender_user_id: user.sender_user_id,
    });
    client.to(user.room_id).emit('append_message', room);
    return room;
  }
}
