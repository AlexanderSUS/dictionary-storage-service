import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DictionaryApiService } from 'src/dictionary-api/dictionary-api.service';
import { RequestedWords } from 'src/types/textProcessing';
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
    const requestedWords: RequestedWords = {
      found: [],
      notFound: [],
    };

    const wordsFromDb = await Promise.all(
      words.map((word) => this.wordsRepository.findOneBy({ word })),
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

      const newWords = await Promise.all(
        found.map((word) => this.wordsRepository.save(word)),
      );

      requestedWords.found = [...requestedWords.found, ...newWords];

      requestedWords.notFound = notFound;
    }

    return requestedWords;
  }
}
