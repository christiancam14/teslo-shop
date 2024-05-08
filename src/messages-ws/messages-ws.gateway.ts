
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message-dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces';

@WebSocketGateway(88, { cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server;

  constructor(
    private readonly messagesWsService: MessagesWsService,

    private readonly jwtService: JwtService,
  ) { }

  async handleConnection(client: Socket) {

    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify(token);
      await this.messagesWsService.registerClient(client, payload.id);
    } catch (error) {

      client.disconnect();
      return;

    }


    this.wss.emit('clients-updated',
      this.messagesWsService.getConnectedClients()
    );
  }

  handleDisconnect(client: Socket) {
    // console.log('Cliente desconectado:', client.id);
    this.messagesWsService.removeClient(client.id);

    this.messagesWsService.getConnectedClients()

  }

  // message-form-client
  @SubscribeMessage('message-from-client')
  onMessageFromClient(client: Socket, payload: NewMessageDto) {

    // messages-from-server
    //! Emite únicamente al cliente
    /*
    client.emit('messages-from-server', {
      fullName: 'Soy yo!',
      message: payload.message || 'no-message!!'
    })
    */

    //! Emite a todos MENOS al cliente inicial
    /*
    client.broadcast.emit('messages-from-server', {
      fullName: 'Soy yo!',
      message: payload.message || 'no-message!!'
    })
    */

    //! Emite a todos
    this.wss.emit('messages-from-server', {
      fullName: this.messagesWsService.getUserFullName(client.id),
      message: payload.message || 'no-message!!'
    })

    // const message = this.messagesWsService.saveMessage(payload);
  }
}
