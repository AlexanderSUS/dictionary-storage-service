import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTextDto } from 'src/text/dto/create-text.dto';
import extractWordsFromText from 'src/utils/handleText';
import normalizePublicWord from 'src/utils/normalizePublicWord';
import { WordsStorageService } from 'src/words-storage/words-storage.service';
import { CreateWordDto } from 'src/words/dto/create-word.dto';

@Injectable()
export class PublicService {
  constructor(
    private readonly wordsStorage: WordsStorageService,
  ) {}

  async parseText({ text } : CreateTextDto) {
    const wordsFromText  = extractWordsFromText(text)

    const wordsFromDb = await this.wordsStorage.getWordsFromDb(wordsFromText);

    return {
      found: wordsFromDb.found.length ? wordsFromDb.found.map(normalizePublicWord) : [],
      notFound: wordsFromDb.notFound,
    }
  }

  async findWord({ word } : CreateWordDto) {
    const wordFromDb = await this.wordsStorage.getWordsFromDb([word]);

    const [wordEntity] = wordFromDb.found;

    if (!wordEntity) {
      throw new HttpException(
        {
          message: 'Word not found',
          word,
        },
        HttpStatus.NOT_FOUND,
      );
    }
    
    return normalizePublicWord(wordEntity)
  }
}
