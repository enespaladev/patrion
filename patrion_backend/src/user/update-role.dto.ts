import { IsEnum, IsUUID } from 'class-validator';
import { Role } from './user.entity';

export class UpdateUserRoleDto {
  @IsUUID()
  userId: string;

  @IsEnum(Role)
  newRole: Role;
}
