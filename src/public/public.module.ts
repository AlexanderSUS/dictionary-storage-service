import { Module } from '@nestjs/common';
import { WordsController } from './public.controller';
import { WordsStorageModule } from 'src/words-storage/words-storage.module';
import { PublicService } from './public.service';

@Module({
  imports: [WordsStorageModule],
  controllers: [WordsController],
  providers: [PublicService],
})
export class PublicModule {}
