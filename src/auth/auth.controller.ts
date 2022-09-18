import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Public } from './public.decorator';
import { RefreshAuthGuard } from './guards/refresh-auth.guard';
import TokensDto from './dto/tokens.dto';
import RefreshDto from './dto/refresh.dto';

@Public()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiCreatedResponse({
    description: 'New user was succesfully created',
    type: String,
  })
  @ApiConflictResponse({ description: 'User already exits' })
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: CreateUserDto, required: true })
  @ApiOkResponse({
    description: 'Return both access and refresh tokens',
    type: TokensDto,
  })
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  @ApiBody({ type: RefreshDto })
  @ApiOkResponse({
    description: 'Return both access and refresh tokens',
    type: TokensDto,
  })
  @ApiForbiddenResponse({ description: 'Refresh token invalid or expired' })
  refresh(@Request() req) {
    return this.authService.refresh(req.user);
  }
}
