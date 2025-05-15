import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { connect, MqttClient } from 'mqtt';
import { InfluxService } from '../influx/influx.service';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import * as fs from 'fs';

@Injectable()
export class MqttService implements OnModuleInit {
  private client: MqttClient;
  private readonly logger = new Logger(MqttService.name);

  constructor(
    private readonly influxService: InfluxService,
    private readonly wsGateway: WebsocketGateway,
  ) {}

  onModuleInit() {
    this.connectToBroker();
  }

  private connectToBroker() {
    try {
      const options = {
        host: 'mosquitto', // docker-compose içindeki service name
        port: 8883,
        protocol: 'mqtts' as const,
        username: 'testuser',
        password: 'testpwd',
        ca: fs.readFileSync('/app/mosquitto/certs/ca.crt'),
        rejectUnauthorized: false, // prod ortamda true olmalı
      };

      this.client = connect(options);

      this.client.on('connect', () => {
        this.logger.log('🟢 MQTT broker TLS bağlantısı başarılı!');

        this.client.subscribe('sensors/#', (err) => {
          if (err) {
            this.logger.error('❌ Topic aboneliği başarısız:', err.message);
          } else {
            this.logger.log('📡 sensors/# aboneliği başarılı.');
          }
        });
      });

      this.client.on('message', async (topic, payload) => {
        try {
          const message = JSON.parse(payload.toString());

          if (
            !message.sensor_id ||
            !message.timestamp ||
            typeof message.temperature !== 'number'
          ) {
            this.logger.warn(`⚠️ Geçersiz payload [${topic}]: ${payload}`);
            return;
          }

          this.logger.log(
            `📥 Sensor [${message.sensor_id}] => Temp: ${message.temperature}, Humidity: ${message.humidity}`,
          );

          // InfluxDB’ye yaz
          await this.influxService.writeSensorData({
            sensor_id: message.sensor_id,
            temperature: message.temperature,
            humidity: message.humidity,
            timestamp: message.timestamp,
          });

          // WebSocket üzerinden client’a gönder
          this.wsGateway.emitSensorData({
            sensor_id: message.sensor_id,
            temperature: message.temperature,
            humidity: message.humidity,
            timestamp: message.timestamp,
          });
        } catch (err) {
          this.logger.error(`❌ Mesaj işlenemedi [${topic}]: ${err.message}`);
        }
      });

      this.client.on('error', (err) => {
        this.logger.error(`❌ MQTT bağlantı hatası: ${err?.message}`, err);
      });
    } catch (err) {
      this.logger.error('❌ TLS bağlantısı başlatılamadı:', err.message);
    }
  }
}
