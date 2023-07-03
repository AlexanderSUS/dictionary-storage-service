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
import {
  ApiTags,
  ApiOkResponse,
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { WordsService } from './words.service';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import parseUuidOptions from 'src/const/uuid';
import QueryDto from './dto/query.dto';
import { ModifiedUserWordDto } from './dto/modified-user-word.dto';

@ApiTags('words')
@ApiBearerAuth()
@Controller('words')
export class WordsController {
  constructor(private readonly wordsService: WordsService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Word was added to user database',
    type: ModifiedUserWordDto,
  })
  @ApiNotFoundResponse({ description: 'Word could not be found via API' })
  @ApiConflictResponse({ description: 'Word already exist in user database' })
  create(@Body() createWordDto: CreateWordDto, @Req() req) {
    return this.wordsService.create(createWordDto, req.user.userId);
  }

  @Get()
  @ApiOkResponse({
    description: 'Return list of words',
    type: ModifiedUserWordDto,
    isArray: true,
  })
  @ApiNotFoundResponse({
    description: 'User has no words or no one word does match query parameters',
  })
  findAll(
    @Query(new ValidationPipe({ forbidNonWhitelisted: true })) query: QueryDto,
    @Req() req,
  ) {
    return this.wordsService.findAll(query, req.user.userId);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Return word by id',
    type: ModifiedUserWordDto,
  })
  @ApiNotFoundResponse({ description: 'Word not found in user store' })
  findOne(
    @Param('id', new ParseUUIDPipe(parseUuidOptions)) id: string,
    @Req() req,
  ) {
    return this.wordsService.findOne(id, req.user.userId);
  }

  @Put(':id')
  @ApiOkResponse({
    description: 'Change word status',
    type: ModifiedUserWordDto,
  })
  @ApiNotFoundResponse({ description: 'Word not found in user store' })
  update(
    @Param('id', new ParseUUIDPipe(parseUuidOptions)) id: string,
    @Body() updateWordDto: UpdateWordDto,
    @Req() req,
  ) {
    return this.wordsService.update(id, updateWordDto, req.user.userId);
  }

  @Delete(':id')
  @ApiNoContentResponse({
    description: 'word was successfully removed from user store',
  })
  @ApiNotFoundResponse({ description: 'Word not found in user store' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', new ParseUUIDPipe(parseUuidOptions)) id: string,
    @Req() req,
  ) {
    await this.wordsService.remove(id, req.user.userId);
  }
}
