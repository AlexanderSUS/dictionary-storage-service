import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'src/config/environment-variables.interface';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh',
) {
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: configService.get('JWT_SECRET_KEY'),
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
