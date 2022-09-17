import { PublicWord } from 'src/types/textProcessing';
import { Word } from 'src/words/entities/word.entity';

export default function normalizePublicWord(wordEntity: Word): PublicWord {
  const { word, phonetic, audio, partOfSpeech, meaning } = wordEntity;

  return { word, phonetic, audio, partOfSpeech, meaning };
}
