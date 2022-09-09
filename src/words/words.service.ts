import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WordStatus } from 'src/const/enum';
import extractNewWords from 'src/utils/extractNewWords';
import extractWordsFromText from 'src/utils/handleText';
import { Repository } from 'typeorm';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import { WordEntity } from './entities/word.entity';

@Injectable()
export class WordsService {
  constructor(
    @InjectRepository(WordEntity)
    private wordsRepository: Repository<WordEntity>,
  ) {}

  async create({ text }: CreateWordDto) {
    const wordsFromText = extractWordsFromText(text);

    const dbRawWords = await this.wordsRepository.find({
      select: {
        word: true,
        id: true,
      },
    });

    const wordsFromDb = dbRawWords.map(({ word }) => word);

    const newWords = extractNewWords(wordsFromText, wordsFromDb);

    return Promise.all(
      newWords.map((word) => this.wordsRepository.save({ word })),
    );
  }

  findAll() {
    return this.wordsRepository.find();
  }

  findAllByStatus(status: string) {
    if (status === WordStatus.LEARNED || status === WordStatus.NEW) {
      return this.wordsRepository.find({
        where: {
          status: status,
        },
      });
    }

    throw new HttpException('Word status not valid', HttpStatus.BAD_REQUEST);
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
