import { Controller, ForbiddenException, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { SensorService } from './sensor.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/user/user.entity';

@Controller('sensors')
export class SensorController {
  constructor(
    private readonly sensorService: SensorService
  ) { }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.SYSTEM_ADMIN, Role.COMPANY_ADMIN, Role.USER)
  @Get(':sensorId/data')
  async getSensorData(
    @Req() req: any,
    @Param('sensorId') sensorId: string,
    @Query('start') start?: string,
  ) {
    const user = req.user;

    if (user.role !== Role.SYSTEM_ADMIN) {
      const hasAccess = await this.sensorService.checkUserSensorAccess(user.id, sensorId);
      if (!hasAccess) throw new ForbiddenException("Bu sensöre erişim yetkiniz yok");
    }

    return this.sensorService.getSensorData(sensorId, start);
  }
}
