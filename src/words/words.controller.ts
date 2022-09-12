import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseUUIDPipe,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { WordsService } from './words.service';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import parseUuidOptions from 'src/const/uuid';
import QueryDto from './dto/query.dto';

@Controller('words')
export class WordsController {
  constructor(private readonly wordsService: WordsService) {}

  @Post()
  create(@Body() createWordDto: CreateWordDto) {
    return this.wordsService.create(createWordDto);
  }

  @Get()
  findAll(
    @Query(new ValidationPipe({ forbidNonWhitelisted: true })) query: QueryDto,
  ) {
    return this.wordsService.findAll(query);
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
