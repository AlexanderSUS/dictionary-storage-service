import { DictionaryApiData } from 'src/types/dictionaryApiResponse';
import { Word } from 'src/words/entities/word.entity';
import getAudio from './getAudio';
import getMeanings from './getMeanings';
import getPhonetic from './getPhonetic';

function parseDictionaryApiData(data: DictionaryApiData[]): Word {
  const [{ word, meanings: dataMeanings }] = data;

  const wordEntity = new Word();

  wordEntity.word = word;
  wordEntity.phonetic = getPhonetic(data);
  wordEntity.audio = getAudio(data);
  wordEntity.meaning = getMeanings(dataMeanings);
  wordEntity.partOfSpeech = Array.from(
    new Set(dataMeanings.map((m) => m.partOfSpeech)),
  );

  return wordEntity;
}

export default parseDictionaryApiData;
