import { Module } from '@nestjs/common';
import { TextService } from './text.service';
import { TextController } from './text.controller';
import { WordsStorageModule } from 'src/words-storage/words-storage.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserWord } from 'src/words/entities/userWord.entity';

@Module({
  imports: [WordsStorageModule, TypeOrmModule.forFeature([UserWord])],
  controllers: [TextController],
  providers: [TextService],
})
export class TextModule {}
