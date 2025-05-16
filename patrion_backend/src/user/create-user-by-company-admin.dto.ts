import { IsEmail, IsString } from 'class-validator';

export class CreateUserByCompanyAdminDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  username: string;
}
