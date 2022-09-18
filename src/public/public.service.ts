import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTextDto } from 'src/text/dto/create-text.dto';
import extractWordsFromText from 'src/utils/handleText';
import normalizePublicWord from 'src/utils/normalizePublicWord';
import { WordsStorageService } from 'src/words-storage/words-storage.service';
import { CreateWordDto } from 'src/words/dto/create-word.dto';
import { ParsedTextDto } from './dto/parsed-text.dto';
import { PublicWordDto } from './dto/public-word.dto';

@Injectable()
export class PublicService {
  constructor(private readonly wordsStorage: WordsStorageService) {}

  async parseText({ text }: CreateTextDto): Promise<ParsedTextDto> {
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
      } as ParsedTextDto,
    );
  }

  async findWord({ word }: CreateWordDto): Promise<PublicWordDto> {
    const wordEntity = await this.wordsStorage.getWordFromDb(word);

    if (!wordEntity) {
      throw new HttpException('Word not found', HttpStatus.NOT_FOUND);
    }

    return normalizePublicWord(wordEntity);
  }
}
