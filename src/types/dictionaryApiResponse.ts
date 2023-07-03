export type WordDefinition = {
  definition: string;
  example?: string;
  synonyms: string[];
  antonyms: string[];
};

export type Meaning = {
  partOfSpeech: string;
  definitions: WordDefinition[];
  synonyms: string[];
  antonyms: string[];
};

export type DictionaryApiData = {
  word: string;
  phonetic: string;
  phonetics: Array<{
    text: string;
    audio?: string;
  }>;
  origin?: string;
  meanings: Meaning[];
};

export type DictionaryApiError = {
  title: string;
  message: string;
  resolution: string;
};
