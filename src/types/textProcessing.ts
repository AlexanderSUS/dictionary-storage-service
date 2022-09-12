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
