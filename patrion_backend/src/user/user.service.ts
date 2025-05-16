import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateUserRoleDto } from './update-role.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async updateUserRole(dto: UpdateUserRoleDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException('Kullanıcı bulunamadı');

    user.role = dto.newRole;
    return this.userRepository.save(user);
  }
}
