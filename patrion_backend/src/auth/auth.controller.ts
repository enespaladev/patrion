import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthService } from './auth.service';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/user/user.entity';
import { CreateUserByCompanyAdminDto } from 'src/user/create-user-by-company-admin.dto';
import { CreateUserDto } from 'src/user/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SYSTEM_ADMIN)
  @Post('register')
  register(
    @Body() body: { email: string; password: string; username: string; role?: Role, companyId: string },
  ) {
    const createUserDto = { email: body.email, password: body.password, role: body.role, companyId: body.companyId };
    return this.authService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COMPANY_ADMIN)
  @Post('register-by-admin')
  registerByCompanyAdmin(
    @Body() body: CreateUserByCompanyAdminDto,
    @Req() req: any,
  ) {
    const user = req.user;

    const dto: CreateUserDto = {
      email: body.email,
      password: body.password,
      companyId: user.company.id,     
      role: Role.USER,                
    };

    return this.authService.register(dto);
  }

}
