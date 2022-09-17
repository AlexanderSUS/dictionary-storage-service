import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTextDto } from 'src/text/dto/create-text.dto';
import { PublicWord, RequestedWords } from 'src/types/textProcessing';
import extractWordsFromText from 'src/utils/handleText';
import normalizePublicWord from 'src/utils/normalizePublicWord';
import { WordsStorageService } from 'src/words-storage/words-storage.service';
import { CreateWordDto } from 'src/words/dto/create-word.dto';

@Injectable()
export class PublicService {
  constructor(private readonly wordsStorage: WordsStorageService) {}

  async parseText({ text }: CreateTextDto): Promise<RequestedWords> {
    const wordsFromText = extractWordsFromText(text);

    const wordsFromDb = await Promise.all(
      wordsFromText.map((word) => this.wordsStorage.getWordFromDb(word)),
    );

    return wordsFromDb.reduce(
      (acc, word, index) => {
        word ? acc.found.push(word) : acc.notFound.push(wordsFromText[index]);

        return acc;
      },
      {
        found: [],
        notFound: [],
      } as RequestedWords,
    );
  }

  async findWord({ word }: CreateWordDto): Promise<PublicWord> {
    const wordEntity = await this.wordsStorage.getWordFromDb(word);

    if (!wordEntity) {
      throw new HttpException('Word not found', HttpStatus.NOT_FOUND);
    }

    return normalizePublicWord(wordEntity);
  }
}
