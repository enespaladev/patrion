import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InfluxDB, Point, QueryApi } from '@influxdata/influxdb-client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class InfluxService implements OnModuleInit {
  private readonly logger = new Logger(InfluxService.name);
  private writeApi;
  private queryApi: QueryApi;

  constructor(private configService: ConfigService) {
    const influxUrl = this.configService.get('INFLUX_URL');
    const token = this.configService.get('INFLUX_TOKEN');
    const org = this.configService.get('INFLUX_ORG');
    const bucket = this.configService.get('INFLUX_BUCKET');

    const client = new InfluxDB({ url: influxUrl, token });
    this.writeApi = client.getWriteApi(org, bucket, 'ns');
    this.writeApi.useDefaultTags({ app: 'patrion-backend' });
    this.queryApi = client.getQueryApi(org);
  }

  async onModuleInit() {
    // Başlangıçta test verisi yaz
    await this.writeSensorData({
      sensor_id: 'test_sensor_init',
      temperature: 25.5,
      humidity: 60,
      timestamp: Math.floor(Date.now() / 1000),
    });
  }

  async writeSensorData(sensorData: {
    sensor_id: string;
    temperature: number;
    humidity: number;
    timestamp: number;
  }) {
    try {
      const point = new Point('sensor_data')
        .tag('sensor_id', sensorData.sensor_id)
        .floatField('temperature', sensorData.temperature)
        .floatField('humidity', sensorData.humidity)
        .timestamp(sensorData.timestamp * 1e9); // Saniye → nanosaniye

      this.writeApi.writePoint(point);
      await this.writeApi.flush(); // Veriyi hemen gönder

      this.logger.log(`Veri yazıldı: ${sensorData.sensor_id}`);
    } catch (error) {
      this.logger.error('InfluxDB yazma hatası:', error);
      throw error;
    }
  }

  async getSensorData(sensorId: string, start?: string): Promise<any> {
    try {
      let query = `from(bucket: "sensor_bucket") 
                      |> range(start: -1h) 
                      |> filter(fn: (r) => r["_measurement"] == "sensor_data" and r["sensor_id"] == "${sensorId}")`;

      if (start) {
        query = `from(bucket: "sensor_bucket") 
                    |> range(start: ${start}) 
                    |> filter(fn: (r) => r["_measurement"] == "sensor_data" and r["sensor_id"] == "${sensorId}")`;
      }

      const result: any[] = [];

      await new Promise<void>((resolve, reject) => {
        this.queryApi.queryRows(query, {
          next(row: string[], tableMeta) {
            const o = tableMeta.toObject(row);
            result.push(o);
          },
          error(error: Error) {
            reject(error);
          },
          complete() {
            resolve();
          },
        });
      });

      return result;
    } catch (error) {
      this.logger.error('InfluxDB sorgulama hatası:', error);
      throw error;
    }
  }

}
