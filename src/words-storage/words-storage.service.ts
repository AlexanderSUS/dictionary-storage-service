import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DictionaryApiService } from 'src/dictionary-api/dictionary-api.service';
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
  private updateWordOccurrence(word: Word) {
    return this.wordsRepository.save({
      ...word,
      occurrence: word.occurrence + 1,
    });
  }

  private updateNotFoundWordOccurrence(word: NotFoundWord) {
    return this.notFoundWordsRepository.save({
      ...word,
      occurrence: word.occurrence + 1,
    });
  }

  async getWordFromDb(word: string): Promise<Word | null> {
    const wordFromDb = await this.wordsRepository.findOneBy({ word });

    if (wordFromDb) {
      await this.updateWordOccurrence(wordFromDb);

      return wordFromDb;
    }

    const notFoundWordFromDb = await this.notFoundWordsRepository.findOneBy({
      word,
    });

    if (notFoundWordFromDb) {
      await this.updateNotFoundWordOccurrence(notFoundWordFromDb);

      return null;
    }

    const wordFromApi = await this.dictionaryApiService.getWordFromApi(word);

    if (wordFromApi) {
      return this.wordsRepository.save(wordFromApi);
    }

    await this.notFoundWordsRepository.save({ word });

    return null;
  }
}
