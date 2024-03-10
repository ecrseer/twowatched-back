import { OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TwaroomService } from './twaroom.service';
import { iTwaMovie } from '../movies/entities/Tmdb';
export declare class TwaroomGateway implements OnGatewayInit, OnGatewayDisconnect {
    private twaroomService;
    ROLEPLAY_WAIT_ROOM_PREFIX: string;
    constructor(twaroomService: TwaroomService);
    handleDisconnect(client: any): void;
    server: Server;
    afterInit(server: any): void;
    client_enter_roleplay_notifications_room(client: Socket, dto: {
        moviesList: iTwaMovie[];
    }): string[];
    private roleplay_room_name;
    private roleplay_room_acceptance_name;
    client_enter_room(dto: {
        room_id: string;
    }, client: Socket): void;
    client_request_roleplay_chat(dto: {
        priority: iTwaMovie;
        moviesList: iTwaMovie[];
    }, client: Socket): void;
    private send_roleplay_room_request;
    private get_client_room_pools;
    client_accept_roleplay_room_request(movie: iTwaMovie, client: Socket): Promise<void>;
    client_sent_message(user: {
        room_id: string;
        sender_user_id: string;
        content: string;
    }, client: Socket): void;
}
