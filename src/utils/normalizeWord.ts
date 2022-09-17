import { NormalizedUserWord } from 'src/types/textProcessing';
import { UserWord } from 'src/words/entities/userWord.entity';

function normalizeWord(userWord: UserWord): NormalizedUserWord {
  const { id, status, word: wordData } = userWord;

  const { id: _, userWords, ...data } = wordData;

  return { id, status, ...data };
}

export default normalizeWord;
