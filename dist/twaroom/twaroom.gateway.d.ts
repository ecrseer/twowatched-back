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
}
