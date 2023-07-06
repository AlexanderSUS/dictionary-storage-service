import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import modifyUserWord from 'src/utils/modifyUserWord';
import { WordsStorageService } from 'src/words-storage/words-storage.service';
import { CreateWordDto } from './dto/create-word.dto';
import { ModifiedUserWordDto } from './dto/modified-user-word.dto';
import QueryDto from './dto/query.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import { UserWordsRepository } from './words.repository';

@Injectable()
export class WordsService {
  constructor(
    private readonly wordsStorage: WordsStorageService,
    private readonly userWordRepository: UserWordsRepository,
  ) {}

  async create(
    createWordDto: CreateWordDto,
    userId: string,
  ): Promise<ModifiedUserWordDto> {
    const userWord = await this.userWordRepository.findByWord(
      createWordDto.word,
      userId,
    );

    if (userWord) {
      throw new ConflictException('This word already in your store');
    }

    const newWord = await this.wordsStorage.getWordFromDb(createWordDto.word);

    if (!newWord) {
      throw new NotFoundException('Word not found');
    }

    const data = await this.userWordRepository.create(newWord, userId);

    return modifyUserWord(data);
  }

  async findAll(query: QueryDto, id: string): Promise<ModifiedUserWordDto[]> {
    const words = await this.userWordRepository.find(query, id);

    return words.map((word) => modifyUserWord(word));
  }

  async findOne(wordId: string, userId: string): Promise<ModifiedUserWordDto> {
    const word = await this.userWordRepository.findOneById(wordId, userId);

    return modifyUserWord(word);
  }

  async update(
    wordId: string,
    updateWordDto: UpdateWordDto,
    userId: string,
  ): Promise<ModifiedUserWordDto> {
    const word = await this.userWordRepository.findOneById(wordId, userId);

    const updatedWord = await this.userWordRepository.update(
      word.id,
      {
        ...word,
        ...updateWordDto,
      },
      userId,
    );

    return modifyUserWord(updatedWord);
  }

  async remove(wordId: string, userId: string) {
    await this.userWordRepository.remove(wordId, userId);
  }
}
