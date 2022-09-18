import { Controller, Post, Body, Req } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
  ApiTags,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { TextService } from './text.service';
import { CreateTextDto } from './dto/create-text.dto';
import { TextResponseDto } from './dto/text-response.dts';

@ApiTags('text')
@ApiBearerAuth()
@Controller('text')
export class TextController {
  constructor(private readonly textService: TextService) {}

  @Post()
  @ApiCreatedResponse({
    description:
      'Service breaks text in to words and match theese words with user strorage. \
        For each new word service tries to find meaning. All founded new words will be stored in user strore',
    type: TextResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'User unauthorized' })
  @ApiNotFoundResponse({ description: 'New words not found' })
  create(@Body() createTextDto: CreateTextDto, @Req() req) {
    return this.textService.create(createTextDto, req.user.userId);
  }
}
