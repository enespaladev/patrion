import { Role } from './user.entity';
import { IsString, IsEmail, IsOptional, IsEnum, IsUUID } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsUUID()
  companyId: string;
}
