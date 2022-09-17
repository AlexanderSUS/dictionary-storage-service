import { WordStatus } from 'src/const/enum';
import NotFoundWord from 'src/words-storage/entities/notFoundWord.entity';
import { UserWord } from 'src/words/entities/userWord.entity';
import { Word } from 'src/words/entities/word.entity';

export type RawDataSet = {
  sentence: string;
  words: string[];
};

export type WordEntityMeaning = {
  partOfSpeech: string;
  definitions: Array<{
    definition: string;
    expample?: string;
  }>;
  synonyms: string[];
  antonyms: string[];
};

export type RequestedWords = {
  found: Word[];
  notFound: string[];
};

export type RequestedNotFroundWords = {
  found: NotFoundWord[];
  notFound: string[];
};

export type RequestedUserWords = {
  found: UserWord[];
  notFound: string[];
};

export type PublicWord = Pick<Word, 'word' | 'meaning' | 'partOfSpeech'> & {
  phonetic: string | null;
  audio: string | null;
};

export type NormalizedUserWord = Omit<Word, 'id'> & {
  id: string;
  status: WordStatus;
};
