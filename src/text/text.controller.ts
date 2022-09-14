import { Controller, Post, Body, Req } from '@nestjs/common';
import { TextService } from './text.service';
import { CreateTextDto } from './dto/create-text.dto';

@Controller('text')
export class TextController {
  constructor(private readonly textService: TextService) {}

  @Post()
  create(@Body() createTextDto: CreateTextDto, @Req() req) {
    return this.textService.create(createTextDto, req.user.userId);
  }
}
