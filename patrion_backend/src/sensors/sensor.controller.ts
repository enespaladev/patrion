import { Controller, Get, Param, Query } from '@nestjs/common';
import { SensorService } from './sensor.service';

@Controller('sensors')
export class SensorController {
  constructor(private readonly sensorService: SensorService) {}

  @Get(':id/data')
  async getSensorData(
    @Param('id') id: string,
    @Query('start') start?: string,  // Örneğin, '1h', '2d' gibi
  ) {
    return this.sensorService.getSensorData(id, start);
  }
}
