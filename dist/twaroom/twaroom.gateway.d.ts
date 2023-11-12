import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TwaroomService } from './twaroom.service';
export declare class TwaroomGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private twaroomService;
    constructor(twaroomService: TwaroomService);
    afterInit(server: any): void;
    server: Server;
    handleConnection(client: any, ...args: any[]): void;
    handleDisconnect(client: any): void;
    handleMessage(data: {
        abc: number;
    }, client: Socket): void;
    client_join_room(data: {
        room_id: string;
        sender_user_id: string;
    }, client: Socket): void;
    client_sent_message(user: {
        room_id: string;
        sender_user_id: string;
        message: string;
    }, client: Socket): void;
}
