import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DictionaryApiService } from 'src/dictionary-api/dictionary-api.service';
import { Word } from 'src/words/entities/word.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WordsStorageService {
  constructor(
    private readonly dictionaryApiService: DictionaryApiService,
    @InjectRepository(Word)
    private wordsRepository: Repository<Word>,
  ) {}
  async getWordsFromDb(words: string[]) {
    const requestedWords: { found: Word[]; notFound: string[] } = {
      found: [],
      notFound: [],
    };

    const wordsFromDb = await Promise.all(
      words.map((word) =>
        this.wordsRepository.findOneBy({
          word,
        }),
      ),
    );

    wordsFromDb.forEach((value, index) => {
      if (value) {
        requestedWords.found.push(value);
      } else {
        requestedWords.notFound.push(words[index]);
      }
    });

    if (requestedWords.notFound.length) {
      const { found, notFound } =
        await this.dictionaryApiService.getWordsFromApi(
          requestedWords.notFound,
        );

      found.forEach((word) => requestedWords.found.push(word));
      requestedWords.notFound = notFound;
    }

    return requestedWords;
  }
}
