import {
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WebsocketGateway {
  @WebSocketServer()
  server: Server;

  emitSensorData(data: any) {
    this.server.emit('sensor_data', data); // istemcilere veri gönder
  }
}
