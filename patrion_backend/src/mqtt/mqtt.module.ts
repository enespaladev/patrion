import { Module } from '@nestjs/common';
import { MqttService } from './mqtt.service';
import { InfluxModule } from 'src/influx/influx.module';
import { WebsocketGateway } from 'src/websocket/websocket.gateway';

@Module({
  imports: [InfluxModule],
  providers: [MqttService, WebsocketGateway],
})
export class MqttModule {}
