import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { WordsStorageService } from 'src/words-storage/words-storage.service';
import { CreateTextDto } from './dto/create-text.dto';
import extractWordsFromText from 'src/utils/handleText';
import { InjectRepository } from '@nestjs/typeorm';
import { UserWord } from 'src/words/entities/userWord.entity';
import { Repository } from 'typeorm';
import modifyUserWord from 'src/utils/modifyUserWord';
import getFindOneOptionsByUserId from 'src/utils/getFindOneWordOptionsByUserId';
import { TextPostAuthResponse } from 'src/types/methodsReturnTypes';

@Injectable()
export class TextService {
  constructor(
    private readonly wordsStorage: WordsStorageService,
    @InjectRepository(UserWord)
    private readonly userWordsRepository: Repository<UserWord>,
  ) {}

  async create(
    { text }: CreateTextDto,
    userId: string,
  ): Promise<TextPostAuthResponse> {
    const wordsFromText = extractWordsFromText(text);

    const userWords = await Promise.all(
      wordsFromText.map((word) =>
        this.userWordsRepository.findOne(
          getFindOneOptionsByUserId(word, userId),
        ),
      ),
    );

    if (!userWords.some((word) => !word)) {
      throw new HttpException('New words not found', HttpStatus.CONFLICT);
    }

    const notFoundWords = userWords.reduce((acc, word, index) => {
      if (!word) {
        acc.push(wordsFromText[index]);
      }
      return acc;
    }, [] as string[]);

    const newWordsFromDb = await Promise.all(
      notFoundWords.map((word) => this.wordsStorage.getWordFromDb(word)),
    );

    const { newWords, notFound } = newWordsFromDb.reduce(
      (acc, word, index) => {
        word
          ? acc.newWords.push(word)
          : acc.notFound.push(notFoundWords[index]);

        return acc;
      },
      { newWords: [], notFound: [] },
    );

    const newUserWords = await Promise.all(
      newWords.map((word) =>
        this.userWordsRepository.save({ word, user: { id: userId } }),
      ),
    );

    return {
      newWords: newUserWords.map(modifyUserWord),
      notFound,
    };
  }
}
