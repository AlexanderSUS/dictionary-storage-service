import { MeaningDto } from 'src/words/dto/meaning.dto';

export class PublicWordDto {
  word: string;
  phonetic: string;
  audio: string;
  partOfSpeech: string[];
  meaning: MeaningDto[];
}
