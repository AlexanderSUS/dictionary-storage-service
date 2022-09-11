import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WordStatus } from 'src/const/enum';
import extractWordsFromText from 'src/utils/handleText';
import { WordsStorageService } from 'src/words-storage/words-storage.service';
import { Repository } from 'typeorm';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import { Word } from './entities/word.entity';

@Injectable()
export class WordsService {
  constructor(
    private readonly wordsStorage: WordsStorageService,
    @InjectRepository(Word)
    private wordsRepository: Repository<Word>,
  ) {}

  async createFromText({ text }: CreateWordDto) {
    const wordsFromText = extractWordsFromText(text);

    return this.wordsStorage.getWordsFromDb(wordsFromText);
  }

  async create(createWordDto: CreateWordDto) {
    const word = createWordDto.text;

    const wordFromDb = await this.wordsRepository.findOneBy({
      word,
    });

    if (wordFromDb) {
      return 'This word allready in your database';
    }

    return this.wordsStorage.getWordsFromDb([createWordDto.text]);
  }

  findAll() {
    return this.wordsRepository.find();
  }

  findAllByStatus(status: WordStatus) {
    return this.wordsRepository.find({
      where: {
        status: status,
      },
    });
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
