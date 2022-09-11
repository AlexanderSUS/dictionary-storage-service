import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtModuleOptions } from 'src/config/jwtModuleOptions';
import { Request } from 'express';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: jwtModuleOptions.secret,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    return {
      id: payload.userId,
      login: payload.login,
      refreshToken: req.body.refreshToken,
    };
  }
}
