export type DictionaryApiOkResopnse = {
  word: string;
  phonetic: string;
  phonetics: Array<{
    text: string;
    audio?: string;
  }>;
  origin: string;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Array<{
      definition: string;
      example: string;
      synonyms: string[];
      antonyms: string[];
    }>;
  }>;
};

export type DictionaryApiErrorResponse = {
  title: string;
  message: string;
  resolution: string;
};
