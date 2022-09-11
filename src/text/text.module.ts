import { Module } from '@nestjs/common';
import { TextService } from './text.service';
import { TextController } from './text.controller';
import { WordsStorageModule } from 'src/words-storage/words-storage.module';

@Module({
  imports: [WordsStorageModule],
  controllers: [TextController],
  providers: [TextService],
})
export class TextModule {}
