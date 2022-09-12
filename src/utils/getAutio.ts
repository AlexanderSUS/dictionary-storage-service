import { DictionaryApiData } from 'src/types/dictionaryApiResponce';

const getAudio = (data: DictionaryApiData[]) => {
  let audio: null | string = null;

  for (let i = 0; i < data.length; i++) {
    if (data[i].phonetics && data[i].phonetics.length) {
      for (let j = 0; j < data[i].phonetics.length; j++) {
        if (data[i].phonetics[j].audio) {
          audio = data[i].phonetics[j].audio;

          return audio;
        }
      }
    }
  }

  return audio;
};

export default getAudio;
