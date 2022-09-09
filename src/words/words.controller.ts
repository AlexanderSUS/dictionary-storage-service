import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseUUIDPipe,
  ParseEnumPipe,
} from '@nestjs/common';
import { WordsService } from './words.service';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import parseUuidOptions from 'src/const/uuid';
import { WordStatus } from 'src/const/enum';

@Controller('words')
export class WordsController {
  constructor(private readonly wordsService: WordsService) {}

  @Post()
  create(@Body() createWordDto: CreateWordDto) {
    return this.wordsService.create(createWordDto);
  }

  @Post('text')
  createFromText(@Body() createWordDto: CreateWordDto) {
    return this.wordsService.createFromText(createWordDto);
  }

  @Get()
  findAll() {
    return this.wordsService.findAll();
  }

  @Get(':status')
  findAllByStatus(
    @Param('status', new ParseEnumPipe(WordStatus)) stauts: WordStatus,
  ) {
    return this.wordsService.findAllByStatus(stauts);
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe(parseUuidOptions)) id: string) {
    return this.wordsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', new ParseUUIDPipe(parseUuidOptions)) id: string,
    @Body() updateWordDto: UpdateWordDto,
  ) {
    return this.wordsService.update(id, updateWordDto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe(parseUuidOptions)) id: string) {
    return this.wordsService.remove(id);
  }
}
