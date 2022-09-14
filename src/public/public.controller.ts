import { Controller, Post, Body } from '@nestjs/common';
import { PublicService } from './public.service';
import { CreateWordDto } from '../words/dto/create-word.dto';
import { Public } from 'src/auth/public.decorator';
import { CreateTextDto } from 'src/text/dto/create-text.dto';

@Public()
@Controller('public')
export class WordsController {
  constructor(private readonly publicService: PublicService) {}

  @Post('words')
  createWord(@Body() createWordDto: CreateWordDto) {
    return this.publicService.findWord(createWordDto);
  }

  @Post('text')
  createText(@Body() createTextDto: CreateTextDto) {
    return this.publicService.parseText(createTextDto);
  }
}
