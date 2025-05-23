import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserManagerService } from '../user/UserManagerService';
import { CreateUserDto } from '../user/create-user.dto'; // CreateUserDto'yu import edin

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserManagerService,
  ) { }

  // async register(email: string, password: string, username: string) {
  //   const hashedPassword = await bcrypt.hash(password, 10);
  //   const user = await this.userRepository.createUser({
  //     email,
  //     password: hashedPassword,
  //     username,
  //   });
  //   return user;
  // }

  async register(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.createUser(createUserDto);
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOneByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }

    const token = this.jwtService.sign({ sub: user.id, role: user.role });
    return { access_token: token };
  }
  // }
}
