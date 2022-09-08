import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import {
  DictionaryApiErrorResponse,
  DictionaryApiOkResopnse,
} from 'src/types/dictionaryApiResponce';
import { DICTIONARY_API_URL } from 'src/const/const';

@Injectable()
export class DictionaryApiService {
  constructor(private readonly httpService: HttpService) {}

  getWordDtataFromApi(
    words: string[],
  ): Observable<
    AxiosResponse<DictionaryApiErrorResponse | DictionaryApiOkResopnse>
  >[] {
    return words.map((word) =>
      this.httpService.get(`${DICTIONARY_API_URL}${word}`),
    );
  }
}
