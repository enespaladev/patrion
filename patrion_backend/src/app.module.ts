import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MqttService } from './mqtt/mqtt.service';
import { MqttModule } from './mqtt/mqtt.module';
import { InfluxService } from './influx/influx.service';
import { InfluxModule } from './influx/influx.module';
import { WebsocketGateway } from './websocket/websocket.gateway';
import { SensorModule } from './sensors/sensor.module';
import { JwtStrategy } from './auth/jwt.strategy';
import { UserLogModule } from './user-log/user-log.module';

import { ThrottlerModule } from '@nestjs/throttler';

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
      envFilePath: '.env', 
    }),

    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60,  // saniye cinsinden süre
          limit: 10 // bu sürede en fazla istek sayısı
        },
      ],
    }),
    
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT!) || 5432,
      username: process.env.DB_USERNAME || 'enes',
      password: process.env.DB_PASSWORD || 'enes123',
      database: process.env.DB_NAME || 'patrion',
      synchronize: true,  // Yalnızca geliştirme aşamasında açın
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      logging: true,      // Hata ayıklamak için
    }),
    UserModule,
    AuthModule,
    MqttModule,
    InfluxModule,
    SensorModule,
    UserLogModule,
  ],
  controllers: [AppController],
  providers: [AppService, MqttService, InfluxService, WebsocketGateway, JwtStrategy],
  exports: [WebsocketGateway],
})
export class AppModule {}
