import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DictionaryApiService } from 'src/dictionary-api/dictionary-api.service';
import {
  RequestedNotFroundWords,
  RequestedWords,
} from 'src/types/textProcessing';
import { Word } from 'src/words/entities/word.entity';
import { Repository } from 'typeorm';
import NotFoundWord from './entities/notFoundWord.entity';

@Injectable()
export class WordsStorageService {
  constructor(
    private readonly dictionaryApiService: DictionaryApiService,
    @InjectRepository(Word)
    private wordsRepository: Repository<Word>,
    @InjectRepository(NotFoundWord)
    private notFoundWordsRepository: Repository<NotFoundWord>,
  ) {}

  private async findWordsInDb(words: string[]) {
    const wordsFromDb = await Promise.all(
      words.map((word) => this.wordsRepository.findOneBy({ word })),
    );

    return wordsFromDb.reduce(
      (acc, word, index) => {
        word ? acc.found.push(word) : acc.notFound.push(words[index]);

        return acc;
      },
      { found: [], notFound: [] } as RequestedWords,
    );
  }

  private async findWordsInNotFoundRepository(words: string[]) {
    const notFoundWordsFromDb = await Promise.all(
      words.map((word) => this.notFoundWordsRepository.findOneBy({ word })),
    );

    return notFoundWordsFromDb.reduce(
      (acc, word, index) => {
        word ? acc.found.push(word) : acc.notFound.push(words[index]);

        return acc;
      },
      { found: [], notFound: [] } as RequestedNotFroundWords,
    );
  }

  private async findWordsViaApi(words: string[]) {
    return this.dictionaryApiService.getWordsFromApi(words);
  }

  private saveNewWords(words: Word[]) {
    return Promise.all(words.map((word) => this.wordsRepository.save(word)));
  }

  private saveNotFoundWords(words: string[]) {
    return Promise.all(
      words.map((word) => this.notFoundWordsRepository.save({ word })),
    );
  }

  private updateWordOccourrence(word: Word) {
    this.wordsRepository.save({ ...word, occourrence: word.occourrence + 1 });
  }

  private updateNotFoundWordOccourrence(word: NotFoundWord) {
    this.notFoundWordsRepository.save({
      ...word,
      occourrence: word.occourrence + 1,
    });
  }

  async getWordsFromDb(words: string[]) {
    const wordsFromDb = await this.findWordsInDb(words);

    wordsFromDb.found.map((word) => this.updateWordOccourrence(word));

    if (!wordsFromDb.notFound.length) {
      return wordsFromDb;
    }

    const notFoundWordsFromDb = await this.findWordsInNotFoundRepository(
      wordsFromDb.notFound,
    );

    notFoundWordsFromDb.found.map((word) =>
      this.updateNotFoundWordOccourrence(word),
    );

    if (!notFoundWordsFromDb.notFound.length) {
      return wordsFromDb;
    }

    const wordsFromApi = await this.findWordsViaApi(
      notFoundWordsFromDb.notFound,
    );

    const newWordsFromDb = await this.saveNewWords(wordsFromApi.found);

    await this.saveNotFoundWords(wordsFromApi.notFound);

    const found = [...wordsFromDb.found, ...newWordsFromDb];
    const notFound = [...wordsFromDb.notFound];

    wordsFromApi.found.forEach((wordEntity) => {
      const index = notFound.findIndex((word) => word === wordEntity.word);

      if (index > -1) {
        notFound.splice(index, 1);
      }
    });

    return { found, notFound };
  }
}
