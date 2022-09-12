import { DictionaryApiData } from 'src/types/dictionaryApiResponce';

const getPhonetic = (data: DictionaryApiData[]) => {
  let phonetic: null | string = null;

  for (let i = 0; i < data.length; i++) {
    if (data[i].phonetic) {
      phonetic = data[i].phonetic;

      return phonetic;
    }
  }

  return phonetic;
};

export default getPhonetic;
