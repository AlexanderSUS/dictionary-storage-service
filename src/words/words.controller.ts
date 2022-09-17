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
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { WordsService } from './words.service';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import parseUuidOptions from 'src/const/uuid';
import QueryDto from './dto/query.dto';

@ApiTags('words')
@ApiBearerAuth()
@Controller('words')
export class WordsController {
  constructor(private readonly wordsService: WordsService) {}

  @Post()
  create(@Body() createWordDto: CreateWordDto, @Req() req) {
    return this.wordsService.create(createWordDto, req.user.userId);
  }

  @Get()
  findAll(
    @Query(new ValidationPipe({ forbidNonWhitelisted: true })) query: QueryDto,
    @Req() req,
  ) {
    return this.wordsService.findAll(query, req.user.userId);
  }

  @Get(':id')
  findOne(
    @Param('id', new ParseUUIDPipe(parseUuidOptions)) id: string,
    @Req() req,
  ) {
    return this.wordsService.findOne(id, req.user.userId);
  }

  @Put(':id')
  update(
    @Param('id', new ParseUUIDPipe(parseUuidOptions)) id: string,
    @Body() updateWordDto: UpdateWordDto,
    @Req() req,
  ) {
    return this.wordsService.update(id, updateWordDto, req.user.userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', new ParseUUIDPipe(parseUuidOptions)) id: string,
    @Req() req,
  ) {
    await this.wordsService.remove(id, req.user.userId);
  }
}
