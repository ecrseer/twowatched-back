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

@WebSocketGateway({ cors: true })
export class TwaroomGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
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
}
