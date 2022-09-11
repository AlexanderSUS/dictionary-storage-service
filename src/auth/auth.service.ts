import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import * as bycrypt from 'bcrypt';
import { IUser } from 'src/user/interfaces/user.interface';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(login: string, pass: string): Promise<IUser | null> {
    const user = await this.userService.findOneByLogin(login);

    const isPasswordMatch = await bycrypt.compare(pass, user.password);

    if (user && isPasswordMatch) {
      const { password, ...result } = user;

      return result;
    }

    return null;
  }

  private getTokens(payload: { login: string; userId: string }) {
    const access_token = this.jwtService.sign(payload, {
      expiresIn: process.env.TOKEN_EXPIRE_TIME,
      secret: process.env.JWT_SECRET_KEY,
    });

    const refresh_token = this.jwtService.sign(payload, {
      expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
      secret: process.env.JWT_SECRET_KEY,
    });

    return { access_token, refresh_token };
  }

  async signUp(createUserDto: CreateUserDto) {
    const password = await bycrypt.hash(
      createUserDto.password,
      parseInt(process.env.CRYPT_SALT),
    );

    await this.userService.create({ ...createUserDto, password });

    return { msg: 'User was successfully created' };
  }

  async login(user: IUser) {
    const tokens = this.getTokens({
      login: user.login,
      userId: user.id,
    });

    const refreshTokenHash = await bycrypt.hash(
      tokens.refresh_token,
      parseInt(process.env.CRYPT_SALT),
    );

    await this.userService.updateRefreshToken(user.id, refreshTokenHash);

    return tokens;
  }

  async refresh({
    id,
    login,
    refreshToken,
  }: {
    id: string;
    login: string;
    refreshToken: string;
  }) {
    const { refreshTokenHash } = await this.userService.findOne(id);

    if (!refreshTokenHash) {
      throw new HttpException('Not authorized', HttpStatus.FORBIDDEN);
    }

    const isRefreshMatch = await bycrypt.compare(
      refreshToken,
      refreshTokenHash,
    );

    if (!isRefreshMatch) {
      throw new HttpException('Not authorized', HttpStatus.FORBIDDEN);
    }

    const tokens = this.getTokens({ login, userId: id });

    const newRefreshTokenHash = await bycrypt.hash(
      tokens.refresh_token,
      parseInt(process.env.CRYPT_SALT),
    );

    await this.userService.updateRefreshToken(id, newRefreshTokenHash);

    return tokens;
  }
}
