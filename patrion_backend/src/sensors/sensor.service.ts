import { Injectable } from '@nestjs/common';
import { InfluxService } from '../influx/influx.service';

@Injectable()
export class SensorService {
  constructor(private readonly influxService: InfluxService) {}

  async getSensorData(id: string, start?: string) {
    try {
      const data = await this.influxService.getSensorData(id, start);
      return data;
    } catch (error) {
      // Hata yönetimi
      throw new Error(`Veri çekilirken hata oluştu: ${error.message}`);
    }
  }
}
