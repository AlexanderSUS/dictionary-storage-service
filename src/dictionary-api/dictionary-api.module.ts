import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Word } from 'src/words/entities/word.entity';
import { DictionaryApiService } from './dictionary-api.service';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Word])],
  providers: [DictionaryApiService],
  exports: [DictionaryApiService],
})
export class DictionaryApiModule {}
