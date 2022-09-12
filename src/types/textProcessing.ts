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
