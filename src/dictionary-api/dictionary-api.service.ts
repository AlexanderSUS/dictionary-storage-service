import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { DictionaryApiData } from 'src/types/dictionaryApiResponce';
import { DICTIONARY_API_URL } from 'src/const/const';
import { Word } from 'src/words/entities/word.entity';
import getPhonetic from 'src/utils/getPhonetic';
import getAudio from 'src/utils/getAutio';

@Injectable()
export class DictionaryApiService {
  constructor(private readonly httpService: HttpService) {}

  private async getWord(word: string): Promise<DictionaryApiData[] | string> {
    const wordUrl = `${DICTIONARY_API_URL}${word}`;

    try {
      const response = await this.httpService.axiosRef.get(wordUrl);

      return response.data;
    } catch (error) {
      return 'NOT_FOUND';
    }
  }

  async getWordsFromApi(words: string[]) {
    const notFound: string[] = [];

    const dataFromApi = await Promise.all(
      words.map((word) => this.getWord(word)),
    );

    const apiWordsData = dataFromApi.reduce((acc, value, index) => {
      if (typeof value === 'string') {
        notFound.push(words[index]);
      } else acc.push(value);

      return acc;
    }, [] as DictionaryApiData[][]);

    const found = apiWordsData.map((wordDataArray) => {
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

      return wordEntity;
    });

    return { found, notFound };
  }
}
