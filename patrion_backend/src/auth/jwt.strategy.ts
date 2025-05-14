import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'supersecretkey',
    });

    console.log('✅ JwtStrategy yüklendi');
  }

  async validate(payload: any) {
    console.log('🎯 JWT doğrulandı:', payload);
    return { userId: payload.sub, role: payload.role }; // null dönülmemeli
  }
}
