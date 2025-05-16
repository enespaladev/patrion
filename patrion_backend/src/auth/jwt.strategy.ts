import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'supersecretkey',
    });

    console.log('✅ JwtStrategy yüklendi');
  }

  async validate(payload: any) {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
      relations: ['company'],
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    console.log('🎯 JWT ile doğrulanan kullanıcı:', user.email);
    return user; 
  }
}
