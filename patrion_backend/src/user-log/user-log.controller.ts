import { Controller, Get, Req, UseGuards, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../user/user.entity'; // enum import
import { Request } from 'express';

declare module 'express' {
  interface Request {
    user?: { userId: string }; 
  }
}
import { UserLogService } from './user-log.service';

@Controller('logs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserLogController {
  constructor(private readonly userLogService: UserLogService) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('system_admin')
  @Get('test-auth')
  test(@Req() req) {
    console.log('🧠 request.user:', req.user);
    return { user: req.user };
  }

  @Get('debug/headers')
  getHeaders(@Req() req: Request) {
    console.log('🔍 Gelen Headerlar:', req.headers);
    return req.headers;
  }

  @Get('view')
  async logView(@Req() req: Request) {
    const user = req.user as any;
    return this.userLogService.logAction(user.userId, 'viewed_logs');
  }

  @Get('history')
  @Roles(Role.SYSTEM_ADMIN)
  async getAllLogs() {
    return this.userLogService.getAllLogs();
  }

  @Roles(Role.SYSTEM_ADMIN)
  @Get('summary/daily')
  async getDailySummary() {
    return this.userLogService.getDailyLogSummary();
  }

  @Roles(Role.SYSTEM_ADMIN)
  @Get('summary/daily/:action')
  async getSummaryByAction(@Param('action') action: string) {
    return this.userLogService.getDailySummaryByAction(action);
  }


}
