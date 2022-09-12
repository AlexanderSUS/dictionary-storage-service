import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import getPartOfSpeechCriterias from 'src/utils/getPartOfSpeechCriteria';
import { WordsStorageService } from 'src/words-storage/words-storage.service';
import { Repository } from 'typeorm';
import { CreateWordDto } from './dto/create-word.dto';
import QueryDto from './dto/query.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import { Word } from './entities/word.entity';

@Injectable()
export class WordsService {
  constructor(
    private readonly wordsStorage: WordsStorageService,
    @InjectRepository(Word)
    private wordsRepository: Repository<Word>,
  ) {}

  async create({ word }: CreateWordDto) {
    const wordFromDb = await this.wordsRepository.findOneBy({
      word,
    });

    if (wordFromDb) {
      return 'This word already in your database';
    }

    return this.wordsStorage.getWordsFromDb([word]);
  }

  async findAll(query: QueryDto) {
    const { status, exclude, include, order, limit, offset } = query;

    const words = await this.wordsRepository.find({
      where: {
        status,
        partOfSpeech: getPartOfSpeechCriterias(exclude, include),
      },
      order: { word: order },
      skip: offset ? parseInt(offset) : 0,
      take: limit ? parseInt(limit) : 10,
    });

    return words;
  }

  async findOne(id: string) {
    const word = this.wordsRepository.findOneBy({ id });

    if (!word) {
      throw new HttpException('Word not found', HttpStatus.NOT_FOUND);
    }

    return word;
  }

  async update(id: string, updateWordDto: UpdateWordDto) {
    const word = await this.wordsRepository.findOneBy({ id });

    if (!word) {
      throw new HttpException('Word not found', HttpStatus.NOT_FOUND);
    }

    return this.wordsRepository.save({ ...word, ...updateWordDto });
  }

  async remove(id: string) {
    const word = await this.wordsRepository.findOneBy({ id });

    if (!word) {
      throw new HttpException('Word not found', HttpStatus.NOT_FOUND);
    }

    return this.wordsRepository.remove(word);
  }
}
