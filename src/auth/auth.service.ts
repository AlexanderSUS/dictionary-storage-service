import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { RefreshPayload } from './interface/refreshPayload';
import { UserWithoutPassword } from 'src/types/methodsReturnTypes';
import TokensDto from './dto/tokens.dto';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'src/config/environment-variables.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {}

  async validateUser(
    login: string,
    pass: string,
  ): Promise<UserWithoutPassword | null> {
    const user = await this.userService.findOneByLogin(login);

    const isPasswordMatch = await bcrypt.compare(pass, user.password);

    if (user && isPasswordMatch) {
      const { password, ...result } = user;

      return result;
    }

    return null;
  }

  private getTokens(payload: { login: string; userId: string }): TokensDto {
    const access_token = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('TOKEN_EXPIRE_TIME'),
      secret: this.configService.get('JWT_SECRET_KEY'),
    });

    const refresh_token = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('TOKEN_REFRESH_EXPIRE_TIME'),
      secret: this.configService.get('JWT_SECRET_KEY'),
    });

    return { access_token, refresh_token };
  }

  async signUp(createUserDto: CreateUserDto): Promise<string> {
    const password = await bcrypt.hash(
      createUserDto.password,
      parseInt(this.configService.get('CRYPT_SALT')),
    );

    await this.userService.create({ ...createUserDto, password });

    return 'User was successfully created';
  }

  async login(user: UserWithoutPassword): Promise<TokensDto> {
    const tokens = this.getTokens({
      login: user.login,
      userId: user.id,
    });

    const refreshTokenHash = await bcrypt.hash(
      tokens.refresh_token,
      parseInt(this.configService.get('CRYPT_SALT')),
    );

    await this.userService.updateRefreshToken(user.id, refreshTokenHash);

    return tokens;
  }

  async refresh({
    id,
    login,
    refreshToken,
  }: RefreshPayload): Promise<TokensDto> {
    const { refreshTokenHash } = await this.userService.findOne(id);

    if (!refreshTokenHash) {
      throw new HttpException('Not authorized', HttpStatus.FORBIDDEN);
    }

    const isRefreshMatch = await bcrypt.compare(refreshToken, refreshTokenHash);

    if (!isRefreshMatch) {
      throw new HttpException('Not authorized', HttpStatus.FORBIDDEN);
    }

    const tokens = this.getTokens({ login, userId: id });

    const newRefreshTokenHash = await bcrypt.hash(
      tokens.refresh_token,
      parseInt(this.configService.get('CRYPT_SALT')),
    );

    await this.userService.updateRefreshToken(id, newRefreshTokenHash);

    return tokens;
  }
}
