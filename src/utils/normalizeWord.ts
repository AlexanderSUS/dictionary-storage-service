import { UserWord } from 'src/words/entities/userWord.entity';

function normalizeWord(userWord: UserWord) {
  const { id, status, word: wordData } = userWord;

  const { word, phonetic, audio, partOfSpeech, meaning, occourrence } =
    wordData;

  return {
    id,
    word,
    status,
    occourrence,
    phonetic,
    audio,
    partOfSpeech,
    meaning,
  };
}

export default normalizeWord;
