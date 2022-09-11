import { DictionaryApiData } from 'src/types/dictionaryApiResponce';

const getAudio = (dataArray: DictionaryApiData[]) => {
  const [element0, element1] = dataArray;

  if (
    element0 &&
    element0.phonetics &&
    element0.phonetics[0] &&
    element0.phonetics[0].audio
  ) {
    return element0.phonetics[0].audio;
  }

  if (
    element1 &&
    element1.phonetics &&
    element1.phonetics[0] &&
    element1.phonetics[0].audio
  ) {
    return element1.phonetics[0].audio;
  }

  return null;
};

export default getAudio;
