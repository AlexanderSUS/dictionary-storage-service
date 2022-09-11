import { Module } from '@nestjs/common';
import { WordsService } from './words.service';
import { WordsController } from './words.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Word } from './entities/word.entity';
import { WordsStorageModule } from 'src/words-storage/words-storage.module';

@Module({
  imports: [TypeOrmModule.forFeature([Word]), WordsStorageModule],
  controllers: [WordsController],
  providers: [WordsService],
})
export class WordsModule {}
