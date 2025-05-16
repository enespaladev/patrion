import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';

@Module({
  imports: [
    // TypeOrmModule.forFeature([User]),
    PassportModule,
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'supersecretkey',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, JwtStrategy, JwtAuthGuard], // ✅ EKLENDİ
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
