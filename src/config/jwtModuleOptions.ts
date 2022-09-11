import { JwtModuleOptions } from '@nestjs/jwt';
import 'dotenv/config';

export const jwtModuleOptions: JwtModuleOptions = {
  secret: process.env.JWT_SECRET_KEY,
  signOptions: { expiresIn: process.env.TOKEN_EXPIRE_TIME },
};
