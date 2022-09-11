import { Injectable } from '@nestjs/common';
import { WordsStorageService } from 'src/words-storage/words-storage.service';
import { CreateTextDto } from './dto/create-text.dto';
import extractWordsFromText from 'src/utils/handleText';

@Injectable()
export class TextService {
  constructor(private readonly wordsStorage: WordsStorageService) {}

  create({ text }: CreateTextDto) {
    const wordsFromText = extractWordsFromText(text);

    return this.wordsStorage.getWordsFromDb(wordsFromText);
  }
}
