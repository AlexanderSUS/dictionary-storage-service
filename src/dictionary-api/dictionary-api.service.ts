import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { DictionaryApiData } from 'src/types/dictionaryApiResponse';
import { DICTIONARY_API_URL } from 'src/const/const';
import parseDictionaryApiData from 'src/utils/parseDictionaryApiData';
import { Word } from 'src/words/entities/word.entity';

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

  async getWordFromApi(word: string): Promise<Word | null> {
    const data = await this.getWord(word);

    if (typeof data === 'string') {
      return null;
    }

    return parseDictionaryApiData(data);
  }
}
