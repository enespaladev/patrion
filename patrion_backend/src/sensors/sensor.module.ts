import { Module } from '@nestjs/common';
import { SensorController } from './sensor.controller';
import { SensorService } from './sensor.service';
import { InfluxService } from '../influx/influx.service';

@Module({
  controllers: [SensorController],
  providers: [SensorService, InfluxService],
})
export class SensorModule {}
