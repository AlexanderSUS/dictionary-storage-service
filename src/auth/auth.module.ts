import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';

@Module({
  imports: [UserModule, PassportModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, RefreshTokenStrategy],
  exports: [AuthService],
})
export class AuthModule {}
