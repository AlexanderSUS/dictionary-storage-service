import { DictionaryApiData } from 'src/types/dictionaryApiResponce';

const getPhonetic = (dataArray: DictionaryApiData[]) => {
  const [element0, element1] = dataArray;

  if (element0 && element0.phonetic) {
    return element0.phonetic;
  }

  if (element1 && element1.phonetic) {
    return element1.phonetic;
  }

  return null;
};

export default getPhonetic;
