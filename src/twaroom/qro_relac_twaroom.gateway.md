Estava pensando se eu deveria migrar pra uma arquitetura onde o websocket tem menos eventos e sempre envia todos os dados, analise o contexto abaixo onde eu estava com um problema onde A causa do problema estava no evento emitido no backend quando alguém aceitava o convite para o Roleplay.

O que acontecia era o seguinte:

O Participante 1 pedia para jogar e entrava numa sala de espera (likes_movie_NomeDoFilme).

O Participante 2 recebia a notificação do pedido, pois também escutava aquela mesma sala.

Quando o Participante 2 clicava em "aceitar", o backend entrava na sala acceptance*room (likes_movie_NomeDoFilme_pool*) e avisava todo mundo lá dentro sobre o sucesso da criação.

O problema é que o Participante 1 NUNCA entrava nessa sala acceptance_room. Ele ficava preso lá na primeira sala aguardando a resposta, logo não recebia o evento de ir para a seleção de personagem.

Correção: Eu já modifiquei o backend no arquivo twowatched-back/src/twaroom/twaroom.gateway.ts para que, no momento que a sala de chat for criada, ele dispare o evento de "entrar na sala" para a mesma wait_room (sala de espera) em que o Participante 1 estava, e não na acceptance_room. Assim, os dois vão receber a ordem para navegar simultaneamente e ninguém fica travado.

## Código Principal: twaroom.gateway.ts

**Caminho:** `/home/gab42/Músicas/twowa/twowatched-back/src/twaroom/twaroom.gateway.ts`

```typescript
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
    const wait_room = this.roleplay_room_name(movie);

    const movie_in_db = await this.moviesService.get_tmdb_movie_by_name(
      movie.title,
    );

    const { room } = await this.twaroomService.create(movie_in_db);
    client.in(wait_room).emit('accepted_roleplay_enter_room', room);
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
```

---

## Mapeamento de Dependências (Busca Automática)

### 1. Back-end - Service Injetado

**Caminho:** `/home/gab42/Músicas/twowa/twowatched-back/src/twaroom/twaroom.service.ts`
_(Responsável por persistir as salas no Mongo)_

```typescript
import { Injectable } from '@nestjs/common';

import { Twaroom } from './entities/twaroom.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TwaMessage } from './entities/twamessage.schema';
import { MovieDocument } from '../movies/entities/movie.schema';

@Injectable()
export class TwaroomService {
  constructor(
    @InjectModel(Twaroom.name) private TwaroomModel: Model<Twaroom>,
  ) {}

  async create(movie?: MovieDocument) {
    const MOCK_ROOM: Omit<Twaroom, '_id'> = {
      name: `${new Date().toLocaleDateString()}-name`,
      media_story_id: `${movie._id}`,
      messages: [],
      usersCharacters: {},
    };
    const created = new this.TwaroomModel(MOCK_ROOM);
    const room = await created.save();
    return { room, created };
  }

  public async findAll() {
    return await this.TwaroomModel.find();
  }

  public async findOne(room_id: string) {
    return await this.TwaroomModel.findOne({ _id: room_id }).exec();
  }

  public async add_message(
    room_id: string,
    message: TwaMessage,
  ): Promise<Twaroom> {
    const updated = await this.TwaroomModel.findOneAndUpdate(
      { _id: room_id },
      { $push: { messages: message } },
      { new: true },
    );

    return updated;
  }

  public async get_most_count_movies_roleplays_from_user(user_id: string) {
    // ...
  }
}
```

### 2. Front-end - Receptor de Eventos do WebSocket

**Caminho:** `/home/gab42/Músicas/twowa/twowatched-front/main/Twaroom/TwaroomReceiverService.ts`
_(Recebe os eventos emitidos pelo Gateway)_

```typescript
import { defineStore } from 'pinia';
import {
  NotificationService,
  type iNotification,
} from '../Notifications/NotificationService';
import { TwaroomService } from './TwaroomService';
import {
  WebsocketConnectionService,
  type iWebsocket,
} from './WebsocketConnectionService';
import type { iTwamessage, iTwaroom } from './dtos';
import type { iTwaMovie } from '../Movies/interfaces';

// ... (store persistence ommited for brevity)

export class TwaroomReceiverService {
  public attach() {
    const ws_connection: iWebsocket =
      WebsocketConnectionService().get_connection();
    ws_connection.on(
      'receive_request_roleplay_chat',
      TwaroomReceiverService.on_request_roleplay_chat,
    );
    ws_connection.on(
      'accepted_roleplay_enter_room',
      TwaroomReceiverService.on_accepted_roleplay_enter_room,
    );
    ws_connection.on(
      'append_message',
      TwaroomReceiverService.on_append_message,
    );
  }

  private static async on_request_roleplay_chat(dto: {
    notification: iNotification;
    movie: iTwaMovie;
  }) {
    const notify_service = new NotificationService();
    const { notification, movie } = dto;
    console.log('=>(TwaroomReceiverService.ts:48) dto', dto);

    notify_service.add_fading_notification(
      {
        ...notification,
        onAccept: () => TwaroomReceiverService.on_accept_roleplay(movie),
      },
      'bottom',
    );
  }

  private static async on_accept_roleplay(movie: iTwaMovie) {
    WebsocketConnectionService()
      .get_connection()
      .emit('accept_roleplay_room_request', movie);
  }

  private static async on_accepted_roleplay_enter_room(room: iTwaroom) {
    const roomService = new TwaroomService();
    roomService.current_room = room;
    await navigateTo({ path: `/room/choose-character` });
  }

  private static async on_append_message(room: iTwaroom) {
    const roomService = new TwaroomService();
    roomService.append_message_to_current_room(room);
  }
}
```

### 3. Front-end - Emissor de Eventos para o WebSocket

**Caminho:** `/home/gab42/Músicas/twowa/twowatched-front/main/Twaroom/TwaroomService.ts`
_(Emite eventos consumidos pelo Gateway e faz a navegação)_

```typescript
import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
// ... imports

export class TwaroomService {
  // ... setup and state ...

  public send_roleplay_chat_request(priority: iTwaMovie) {
    const ws_connection: iWebsocket =
      WebsocketConnectionService().get_connection();

    const moviesList = this.moviesService.getMovies();
    ws_connection.emit('request_roleplay_chat', { priority, moviesList });
  }

  public async enter_roleplay_notifications_room() {
    let user = await this.userService.tryGetRealUser();

    if (!user) {
      user = this.userService.getTabUserInfo();
    }
    const moviesList = user?.moviesList;

    if (!moviesList?.length)
      throw new Error('Cant enter notification movie room');

    const ws_connection: iWebsocket =
      WebsocketConnectionService().get_connection();
    const dto: iEnterRoleplayRoomDto = {
      moviesListIds: moviesList,
    };
    ws_connection.emit('enter_roleplay_notifications_room', dto);
  }

  public enter_room_websocket() {
    const ws_connection: iWebsocket =
      WebsocketConnectionService().get_connection();
    const room_id = this.persistence?.current_room?._id;
    if (room_id) {
      ws_connection.emit('enter_room', { room_id });
    }
  }

  public send_message_to_room(user_msg: iTwamessage) {
    const ws_connection: iWebsocket =
      WebsocketConnectionService().get_connection();
    const user_message: iTwamessage = {
      ...user_msg,
      sender_user_id: this.userService.getTabUserInfo()._id,
    };
    ws_connection.emit('send_message', user_message, (room: iTwaroom) => {
      this.append_message_to_current_room(room);
    });
  }
}
```
