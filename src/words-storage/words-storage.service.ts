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
    const requestedWords: RequestedWords = { found: [], notFound: [] };

    const wordsFromDb = await Promise.all(
      words.map((word) => this.wordsRepository.findOneBy({ word })),
    );

    wordsFromDb.forEach((word, index) => {
      if (word) {
        requestedWords.found.push(word);
        this.updateWordOccourrence(word);
      } else {
        requestedWords.notFound.push(words[index]);
      }
    });

    return requestedWords;
  }

  private async findWordsInNotFoundRepository(words: string[]) {
    const notFoundWordsFromDb = await Promise.all(
      words.map((word) => this.notFoundWordsRepository.findOneBy({ word })),
    );

    const requestedWords: RequestedNotFroundWords = { found: [], notFound: [] };

    notFoundWordsFromDb.forEach((word, index) => {
      if (word) {
        requestedWords.found.push(word);
        this.updateNotFoundWordOccourrence(word);
      } else {
        requestedWords.notFound.push(words[index]);
      }
    });

    return requestedWords;
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

    if (!wordsFromDb.notFound.length) {
      return wordsFromDb;
    }

    const notFoundWordsFromDb = await this.findWordsInNotFoundRepository(
      wordsFromDb.notFound,
    );

    if (!notFoundWordsFromDb.notFound.length) {
      return wordsFromDb;
    }

    const wordsFromApi = await this.findWordsViaApi(
      notFoundWordsFromDb.notFound,
    );

    const newWordsFromDb = await this.saveNewWords(wordsFromApi.found);

    this.saveNotFoundWords(wordsFromApi.notFound);

    wordsFromDb.found = [...wordsFromDb.found, ...newWordsFromDb];

    wordsFromApi.found.forEach((wordEntity) => {
      const index = wordsFromDb.notFound.findIndex(
        (word) => word === wordEntity.word,
      );

      if (index > -1) {
        wordsFromDb.notFound.splice(index, 1);
      }
    });

    return wordsFromDb;
  }
}
