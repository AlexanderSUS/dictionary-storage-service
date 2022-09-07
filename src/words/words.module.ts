import { Module } from '@nestjs/common';
import { WordsService } from './words.service';
import { WordsController } from './words.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WordEntity } from './entities/word.entity';
import { ExampleEntity } from './entities/expamle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WordEntity, ExampleEntity])],
  controllers: [WordsController],
  providers: [WordsService],
})
export class WordsModule {}
