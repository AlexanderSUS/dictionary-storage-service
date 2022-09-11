import { Module } from '@nestjs/common';
import { WordsService } from './words.service';
import { WordsController } from './words.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Word } from './entities/word.entity';
import { DictionaryApiModule } from 'src/dictionary-api/dictionary-api.module';

@Module({
  imports: [TypeOrmModule.forFeature([Word]), DictionaryApiModule],
  controllers: [WordsController],
  providers: [WordsService],
})
export class WordsModule {}
