import { Injectable } from '@nestjs/common';
import { InfluxService } from '../influx/influx.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Sensor } from './sensor.entity';
import { Repository } from 'typeorm';
import { Role, User } from 'src/user/user.entity';

@Injectable()
export class SensorService {
  constructor(
    private readonly influxService: InfluxService,
    @InjectRepository(Sensor)
    private readonly sensorRepository: Repository<Sensor>,
  ) { }

  async checkUserSensorAccess(user: User, sensorId: string): Promise<boolean> {
    // SYSTEM_ADMIN kontrolü
    if (user.role === Role.SYSTEM_ADMIN) return true;

    // USER için allowedUsers kontrolü
    const hasUserAccess = await this.sensorRepository
      .createQueryBuilder('sensor')
      .innerJoin('sensor.allowedUsers', 'user')
      .where('sensor.id = :sensorId', { sensorId })
      .andWhere('user.id = :userId', { userId: user.id })
      .getExists();

    if (hasUserAccess) return true;

    // COMPANY_ADMIN için şirket kontrolü
    if (user.role === Role.COMPANY_ADMIN) {
      return this.sensorRepository
        .createQueryBuilder('sensor')
        .innerJoin('sensor.company', 'company')
        .where('sensor.id = :sensorId', { sensorId })
        .andWhere('company.adminId = :userId', { userId: user.id })
        .getExists();
    }

    return false;
  }

  async getSensorData(id: string, start?: string) {
    try {
      const data = await this.influxService.getSensorData(id, start);
      return data;
    } catch (error) {
      throw new Error(`Veri çekilirken hata oluştu: ${error.message}`);
    }
  }
}
