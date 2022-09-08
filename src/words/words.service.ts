import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WordStatus } from 'src/const/enum';
import extractNewWords from 'src/utils/extractNewWords';
import handleText from 'src/utils/handleText';
import { Repository } from 'typeorm';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import { ExampleEntity } from './entities/expamle.entity';
import { WordEntity } from './entities/word.entity';

@Injectable()
export class WordsService {
  constructor(
    @InjectRepository(WordEntity)
    private wordsRepository: Repository<WordEntity>,
    @InjectRepository(ExampleEntity)
    private exampleRepository: Repository<ExampleEntity>,
  ) {}

  async create({ text }: CreateWordDto) {
    const newWordsAndExamples = handleText(text);

    const dbRawWords = await this.wordsRepository.find({
      select: {
        word: true,
      },
    });

    const wordsFromDb = dbRawWords.map(({ word }) => word);

    const newWordsData = extractNewWords(newWordsAndExamples, wordsFromDb);

    const promisesOfSavedExamples = newWordsData.map((set) =>
      this.exampleRepository.save({ sentence: set.sentence }),
    );

    const savedExamples = await Promise.all(promisesOfSavedExamples);

    const newSavedWords = savedExamples.map((example, index) =>
      newWordsData[index].words.map((word) =>
        this.wordsRepository.save({ word, exampleId: example.id }),
      ),
    );

    const words = await Promise.all(newSavedWords.flat());

    return { savedExamples, words };
  }

  findAll() {
    return this.wordsRepository.find({
      relations: {
        example: true,
      },
    });
  }

  findAllByStatus(status: string) {
    if (status === WordStatus.LEARNED || status === WordStatus.NEW) {
      return this.wordsRepository.find({
        where: {
          status: status,
        },
        relations: {
          example: true,
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
