import { Injectable } from '@nestjs/common';
import { WordsStorageService } from 'src/words-storage/words-storage.service';
import { CreateTextDto } from './dto/create-text.dto';
import extractWordsFromText from 'src/utils/handleText';
import { InjectRepository } from '@nestjs/typeorm';
import { UserWord } from 'src/words/entities/userWord.entity';
import { Repository } from 'typeorm';
import { RequestedUserWords } from 'src/types/textProcessing';
import normalizeWord from 'src/utils/normalizeWord';

@Injectable()
export class TextService {
  constructor(private readonly wordsStorage: WordsStorageService,
    @InjectRepository(UserWord)
    private readonly userWordsRepository: Repository<UserWord>
    ) {}

  async create({ text }: CreateTextDto, userId: string) {
    const wordsFromText = extractWordsFromText(text);

    const userWords = await Promise.all(wordsFromText.map((word) => 
        this.userWordsRepository.findOne({
          where: {
            user: { id: userId },
            word: { word },
          },
          relations: {
            word: true,
          },
        })
    )); 

    const requestedWords: RequestedUserWords = userWords.reduce((acc, word, index) => {
      word ? acc.found.push(word) : acc.notFound.push(wordsFromText[index]);

     return acc;
    }, { found: [], notFound: []} as RequestedUserWords)

    if (!requestedWords.notFound.length) {
      return { 
        old: requestedWords.found.map(normalizeWord),
        new: [],
        notFound: [],
      };
    }

    const newWords =  await this.wordsStorage.getWordsFromDb(requestedWords.notFound);
   
    if (!newWords.found.length) {
      return {
        old: requestedWords.found.map(normalizeWord),
        new: [],
        notFound: requestedWords.notFound,
      }
    }

    const newUserWords = await Promise.all(
      newWords.found.map((word) => this.userWordsRepository.save({ user: { id: userId }, word }))
    )

    return {
      old: requestedWords.found.map(normalizeWord),
      new: newUserWords.map(normalizeWord),
      notFound: newWords.notFound,
    }
  }
}
