import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role, User } from './user.entity';
import { UpdateUserRoleDto } from './update-role.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async updateUserRole(dto: UpdateUserRoleDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException('Kullanıcı bulunamadı');

    user.role = dto.newRole;
    return this.userRepository.save(user);
  }

  async getUsersByRole(currentUser: User): Promise<User[]> {
    if (currentUser.role === Role.SYSTEM_ADMIN) {
      return this.userRepository.find({
        relations: ['company'],
      });
    }

    if (currentUser.role === Role.COMPANY_ADMIN) {
      return this.userRepository.find({
        where: { company: { id: currentUser.company.id } },
        relations: ['company'],
      });
    }

    throw new ForbiddenException('Bu işlemi yapamazsınız');
  }

}
