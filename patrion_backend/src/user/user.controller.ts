import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Role } from './user.entity';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UpdateUserRoleDto } from './update-role.dto';
import { UserService } from './user.service';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService
  ) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SYSTEM_ADMIN, Role.COMPANY_ADMIN)
  @Get()
  async getAllUsers(@Req() req) {
    return this.userService.getUsersByRole(req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SYSTEM_ADMIN)
  @Patch('update-role')
  updateRole(@Body() dto: UpdateUserRoleDto) {
    return this.userService.updateUserRole(dto);
  }
}
