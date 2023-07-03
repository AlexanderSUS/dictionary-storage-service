import { WordStatus } from 'src/const/enum';
import { MeaningDto } from './meaning.dto';

export class ModifiedUserWordDto {
  id: string;
  word: string;
  status: WordStatus;
  phonetic: string | null;
  audio: string | null;
  partOfSpeech: string[];
  meaning: MeaningDto[];
  occurrence: number;
}
