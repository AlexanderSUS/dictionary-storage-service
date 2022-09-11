import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtModuleOptions } from 'src/config/jwtModuleOptions';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtModuleOptions.secret,
    });
  }

  async validate(payload: any) {
    return { userId: payload.userId, login: payload.login };
  }
}
