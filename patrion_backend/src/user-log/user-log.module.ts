import { Module } from '@nestjs/common';
import { UserLogService } from './user-log.service';
import { UserLogController } from './user-log.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserLog } from './user-log.entity';
import { LogsGateway } from 'src/logs/logs.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([UserLog])],
  providers: [UserLogService, LogsGateway],
  controllers: [UserLogController],
  exports: [UserLogService],
})
export class UserLogModule {}