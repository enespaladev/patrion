import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserLog } from './user-log.entity';
import { LogsGateway } from 'src/logs/logs.gateway';

@Injectable()
export class UserLogService {
  constructor(
    @InjectRepository(UserLog)
    private readonly userLogRepository: Repository<UserLog>,
    private readonly logsGateway: LogsGateway,
  ) { }

  async logAction(userId: string, action: string) {
    const log = this.userLogRepository.create({
      userId,
      action,
    });
    const saved = await this.userLogRepository.save(log);

    this.logsGateway.emitLogViewed({
      userId: saved.userId,
      timestamp: saved.timestamp,
      action: saved.action,
    });

    return saved;
  }

  async getAllLogs() {
    return this.userLogRepository.find({
      order: { timestamp: 'DESC' },
    });
  }

  async getDailyLogSummary() {
    return this.userLogRepository
      .createQueryBuilder('log')
      .select("DATE_TRUNC('day', log.timestamp)", 'date')
      .addSelect('COUNT(*)', 'count')
      .groupBy("DATE_TRUNC('day', log.timestamp)")
      .orderBy('date', 'ASC')
      .getRawMany();
  }

  async getDailySummaryByAction(action: string) {
    return this.userLogRepository
      .createQueryBuilder('log')
      .select("DATE_TRUNC('day', log.timestamp)", 'date')
      .addSelect('COUNT(*)', 'count')
      .where('log.action = :action', { action })
      .groupBy("DATE_TRUNC('day', log.timestamp)")
      .orderBy('date', 'ASC')
      .getRawMany();
  }

}
