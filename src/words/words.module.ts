import { Module } from '@nestjs/common';
import { WordsService } from './words.service';
import { WordsController } from './words.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WordsStorageModule } from 'src/words-storage/words-storage.module';
import { UserWord } from './entities/userWord.entity';
import { UserWordsRepository } from './words.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserWord]), WordsStorageModule],
  controllers: [WordsController],
  providers: [WordsService, UserWordsRepository],
})
export class WordsModule {}
