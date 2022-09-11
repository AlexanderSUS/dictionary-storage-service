import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Public } from './public.decorator';
import { RefreshAuthGuard } from './guards/refresh-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  singup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req) {
    const { access_token, refresh_token } = await this.authService.login(
      req.user,
    );

    return {
      accessToken: access_token,
      refreshToken: refresh_token,
    };
  }

  @Public()
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Request() req) {
    return this.authService.refresh(req.user);
  }
}
