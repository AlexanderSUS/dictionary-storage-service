import { Injectable } from '@nestjs/common';
import { CreateTextDto } from 'src/text/dto/create-text.dto';
import extractWordsFromText from 'src/utils/handleText';
import { WordsStorageService } from 'src/words-storage/words-storage.service';
import { CreateWordDto } from 'src/words/dto/create-word.dto';

@Injectable()
export class PublicService {
  constructor(
    private readonly wordsStorage: WordsStorageService,
  ) {}

  async parseText({ text } : CreateTextDto) {
    const wordsFromText  = extractWordsFromText(text)

    const wordsFromDb = await this.wordsStorage.getWordsFromDb(wordsFromText);

    const found = wordsFromDb.found.map((wordData) => ({
      word: wordData.word,
      phonetic: wordData.phonetic,
      audio: wordData.audio,
      partOfSpeech: wordData.partOfSpeech,
      meaning: wordData.meaning,
    }))

    return {
      found,
      notFound: wordsFromDb.notFound,
    }
  }

  async findWord({ word } : CreateWordDto) {
    const wordFromDb = await this.wordsStorage.getWordsFromDb([word]);

    const found = wordFromDb.found.map((wordData) => ({
      word: wordData.word,
      phonetic: wordData.phonetic,
      audio: wordData.audio,
      partOfSpeech: wordData.partOfSpeech,
      meaning: wordData.meaning,
    }))

    return {
      found,
      notFound: wordFromDb.notFound,
    }
  }
}
