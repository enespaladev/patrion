import { Module } from '@nestjs/common';
import { SensorController } from './sensor.controller';
import { SensorService } from './sensor.service';
import { InfluxService } from '../influx/influx.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sensor } from './sensor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sensor])],
  controllers: [SensorController],
  providers: [SensorService, InfluxService],
})
export class SensorModule {}
