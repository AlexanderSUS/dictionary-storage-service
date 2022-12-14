import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import getFindOneOptionsByUserId from 'src/utils/getFindOneWordOptionsByUserId';
import getPartOfSpeechCriterias from 'src/utils/getPartOfSpeechCriteria';
import modifyUserWord from 'src/utils/modifyUserWord';
import { WordsStorageService } from 'src/words-storage/words-storage.service';
import { Repository } from 'typeorm';
import { CreateWordDto } from './dto/create-word.dto';
import { ModifiedUserWordDto } from './dto/modified-user-word.dto';
import QueryDto from './dto/query.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import { UserWord } from './entities/userWord.entity';

@Injectable()
export class WordsService {
  constructor(
    private readonly wordsStorage: WordsStorageService,
    @InjectRepository(UserWord)
    private userWordRepository: Repository<UserWord>,
  ) {}

  async create(
    { word }: CreateWordDto,
    userId: string,
  ): Promise<ModifiedUserWordDto> {
    const userWord = await this.userWordRepository.findOne(
      getFindOneOptionsByUserId(word, userId),
    );

    if (userWord) {
      throw new HttpException(
        'This word already in your srore',
        HttpStatus.CONFLICT,
      );
    }

    const newWord = await this.wordsStorage.getWordFromDb(word);

    if (!newWord) {
      throw new HttpException('Word not found', HttpStatus.NOT_FOUND);
    }

    const data = await this.userWordRepository.save({
      user: { id: userId },
      word: newWord,
    });

    return modifyUserWord(data);
  }

  async findAll(query: QueryDto, id: string): Promise<ModifiedUserWordDto[]> {
    const { status, exclude, include, order, limit, offset } = query;

    const words = await this.userWordRepository.find({
      where: {
        user: {
          id,
        },
        status,
        word: {
          partOfSpeech: getPartOfSpeechCriterias(exclude, include),
        },
      },
      order: {
        word: {
          word: order,
        },
      },
      relations: {
        word: true,
      },
      skip: offset ? parseInt(offset) : 0,
      take: limit ? parseInt(limit) : 10,
    });

    if (!words.length) {
      throw new HttpException('Words not found', HttpStatus.NOT_FOUND);
    }

    return words.map((word) => modifyUserWord(word));
  }

  async findOne(wordId: string, userId: string): Promise<ModifiedUserWordDto> {
    const word = await this.userWordRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        id: wordId,
      },
      relations: {
        word: true,
      },
    });

    if (!word) {
      throw new HttpException('Word not found', HttpStatus.NOT_FOUND);
    }

    return modifyUserWord(word);
  }

  async update(
    wordId: string,
    updateWordDto: UpdateWordDto,
    userId: string,
  ): Promise<ModifiedUserWordDto> {
    const word = await this.userWordRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        id: wordId,
      },
    });

    if (!word) {
      throw new HttpException('Word not found', HttpStatus.NOT_FOUND);
    }

    const updatedWord = await this.userWordRepository.save({
      ...word,
      ...updateWordDto,
    });

    return modifyUserWord(updatedWord);
  }

  async remove(wordId: string, userId: string) {
    const word = await this.userWordRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        id: wordId,
      },
    });

    if (!word) {
      throw new HttpException('Word not found', HttpStatus.NOT_FOUND);
    }

    await this.userWordRepository.remove(word);
  }
}
