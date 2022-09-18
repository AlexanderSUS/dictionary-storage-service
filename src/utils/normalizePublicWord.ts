import { PublicWordDto } from 'src/public/dto/public-word.dto';
import { Word } from 'src/words/entities/word.entity';

export default function normalizePublicWord(wordEntity: Word): PublicWordDto {
  const { word, phonetic, audio, partOfSpeech, meaning } = wordEntity;

  return { word, phonetic, audio, partOfSpeech, meaning };
}
