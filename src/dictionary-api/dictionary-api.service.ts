import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { DictionaryApiData } from 'src/types/dictionaryApiResponce';
import { DICTIONARY_API_URL } from 'src/const/const';
import parseDictionaryApiData from 'src/utils/parseDictionaryApiData';
import { RequestedWords } from 'src/types/textProcessing';

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
    const dataFromApi = await Promise.all( words.map((word) => this.getWord(word)));

    return dataFromApi.reduce((acc, data, index) => {
      typeof data === 'string' ? acc.notFound.push(words[index]) : acc.found.push(parseDictionaryApiData(data))

      return acc;
    }, { found: [], notFound: [] } as RequestedWords)
  }
}
