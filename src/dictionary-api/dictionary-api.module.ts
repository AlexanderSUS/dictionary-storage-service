import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { DictionaryApiService } from './dictionary-api.service';

@Module({
  imports: [HttpModule],
  providers: [DictionaryApiService],
  exports: [DictionaryApiService],
})
export class DictionaryApiModule {}
