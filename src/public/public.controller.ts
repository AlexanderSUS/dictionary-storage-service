import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { PublicService } from './public.service';
import { CreateWordDto } from '../words/dto/create-word.dto';
import { Public } from 'src/auth/public.decorator';
import { CreateTextDto } from 'src/text/dto/create-text.dto';
import { PublicWordDto } from './dto/public-word.dto';
import { ParsedTextDto } from './dto/parsed-text.dto';

@ApiTags('public')
@Public()
@Controller('public')
export class WordsController {
  constructor(private readonly publicService: PublicService) {}

  @HttpCode(HttpStatus.OK)
  @Post('words')
  @ApiOkResponse({
    description: 'Return word with its meaning',
    type: PublicWordDto,
  })
  @ApiNotFoundResponse({ description: 'Word not found via API' })
  createWord(@Body() createWordDto: CreateWordDto) {
    return this.publicService.findWord(createWordDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('text')
  @ApiOkResponse({
    description:
      'Service breaks text in to words. For each word service \
       tries to find meaning. Then rerurn list found and not found words',
    type: ParsedTextDto,
  })
  createText(@Body() createTextDto: CreateTextDto) {
    return this.publicService.parseText(createTextDto);
  }
}
