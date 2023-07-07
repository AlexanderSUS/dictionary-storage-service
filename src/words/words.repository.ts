import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserWord } from './entities/userWord.entity';
import QueryDto from './dto/query.dto';
import getPartOfSpeechCriteria from 'src/utils/getPartOfSpeechCriteria';
import { UpdateWordDto } from './dto/update-word.dto';
import { Word } from './entities/word.entity';

@Injectable()
export class UserWordsRepository {
  constructor(
    @InjectRepository(UserWord)
    private readonly userWordsRepository: Repository<UserWord>,
  ) {}

  async create(word: Word, userId: string) {
    const newWord = new UserWord();
    newWord.word = word;
    newWord.user.id = userId;

    return await this.userWordsRepository.save(newWord);
  }

  async find(query: QueryDto, userId: string) {
    const { status, exclude, include, order, limit, offset } = query;

    const words = await this.userWordsRepository.find({
      where: {
        user: {
          id: userId,
        },
        status,
        word: {
          partOfSpeech: getPartOfSpeechCriteria(exclude, include),
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
      throw new NotFoundException('Words not found');
    }

    return words;
  }

  async findByWord(word: string, userId: string) {
    return this.userWordsRepository.findOne({
      where: {
        word: {
          word,
        },
        user: {
          id: userId,
        },
      },
    });
  }

  async findOneById(wordId: string, userId: string) {
    const word = await this.userWordsRepository.findOne({
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
      throw new NotFoundException('Word not found');
    }

    return word;
  }

  async update(wordId: string, updateWordDto: UpdateWordDto, userId: string) {
    const word = await this.userWordsRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        id: wordId,
      },
    });

    if (!word) {
      throw new NotFoundException('Word not found');
    }

    const updatedWord = await this.userWordsRepository.save({
      ...word,
      ...updateWordDto,
    });

    return updatedWord;
  }

  async remove(wordId: string, userId: string) {
    const word = await this.userWordsRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        id: wordId,
      },
    });

    if (!word) {
      throw new NotFoundException('Word not found');
    }

    await this.userWordsRepository.remove(word);
  }
}
