import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt'; 
import { User } from './user.entity';
import { UserManagerService } from './UserManagerService';
import { UserController } from './user.controller';
import { Company } from 'src/company/company.entity';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Company]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultsecret',
    }),  
  ],
  providers: [UserManagerService, UserService],
  exports: [
    TypeOrmModule.forFeature([User]),
    UserManagerService, 
    UserService
  ],
  controllers: [UserController],
})
export class UserModule {}
