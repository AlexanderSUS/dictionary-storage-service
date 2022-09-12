import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { DictionaryApiData } from 'src/types/dictionaryApiResponce';
import { DICTIONARY_API_URL } from 'src/const/const';
import parseDictionaryApiData from 'src/utils/parseDictionaryApiData';

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
      return parseDictionaryApiData(wordDataArray);
    });

    return { found, notFound };
  }
}
