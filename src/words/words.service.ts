import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
    const dataSet = handleText(text);

    const dbRawWords = await this.wordsRepository.find({
      select: { word: true },
    });

    const newWordsData = extractNewWords(
      dataSet,
      dbRawWords.map(({ word }) => word),
    );

    const promisesArray = newWordsData.map((set) =>
      this.exampleRepository.save({ sentence: set.sentence }),
    );

    const examples = await Promise.all(promisesArray);

    const dataArray = examples.map((example, index) =>
      newWordsData[index].words.map((word) =>
        this.wordsRepository.save({ word, exampleId: example.id }),
      ),
    );

    const words = await Promise.all(dataArray.flat());

    return { examples, words };
  }

  findAll() {
    return `This action returns all words`;
  }

  findOne(id: number) {
    return `This action returns a #${id} word`;
  }

  update(id: number, updateWordDto: UpdateWordDto) {
    return `This action updates a #${id} word`;
  }

  remove(id: number) {
    return `This action removes a #${id} word`;
  }
}
