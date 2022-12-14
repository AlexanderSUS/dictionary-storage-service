import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DictionaryApiModule } from 'src/dictionary-api/dictionary-api.module';
import { Word } from 'src/words/entities/word.entity';
import NotFoundWord from './entities/notFoundWord.entity';
import { WordsStorageService } from './words-storage.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Word, NotFoundWord]),
    DictionaryApiModule,
  ],
  providers: [WordsStorageService],
  exports: [WordsStorageService],
})
export class WordsStorageModule {}
