import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { DictionaryApiData } from 'src/types/dictionaryApiResponce';
import { DICTIONARY_API_URL } from 'src/const/const';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Word } from 'src/words/entities/word.entity';
import getPhonetic from 'src/utils/getPhonetic';
import getAudio from 'src/utils/getAutio';

@Injectable()
export class DictionaryApiService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Word)
    private wordsRepository: Repository<Word>,
  ) {}

  private async getWordFromApi(
    word: string,
  ): Promise<DictionaryApiData[] | string> {
    const wordUrl = `${DICTIONARY_API_URL}${word}`;

    try {
      const response = await this.httpService.axiosRef.get(wordUrl);

      return response.data;
    } catch (error) {
      return 'NOT_FOUND';
    }
  }

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
      const dataFromApi = await Promise.all(
        requestedWords.notFound.map((word) => this.getWordFromApi(word)),
      );

      const notFoundWords = [...requestedWords.notFound];
      requestedWords.notFound = [];

      const apiWordsData = dataFromApi.reduce((acc, value, index) => {
        if (typeof value === 'string') {
          requestedWords.notFound.push(notFoundWords[index]);
        } else acc.push(value);

        return acc;
      }, [] as DictionaryApiData[][]);

      const savedWords = await Promise.all(
        apiWordsData.map((wordDataArray) => {
          const [element0] = wordDataArray;

          const phonetic = getPhonetic(wordDataArray);

          const audio = getAudio(wordDataArray);

          const partOfSpeech = Array.from(
            new Set(element0.meanings.map((meaning) => meaning.partOfSpeech)),
          );

          const wordEntity = new Word();

          wordEntity.word = element0.word;
          wordEntity.phonetic = phonetic;
          wordEntity.audio = audio;
          wordEntity.partOfSpeech = partOfSpeech;
          wordEntity.meaning = element0.meanings;

          return this.wordsRepository.save(wordEntity);
        }),
      );

      savedWords.forEach((word) => requestedWords.found.push(word));
    }

    return requestedWords;
  }
}
