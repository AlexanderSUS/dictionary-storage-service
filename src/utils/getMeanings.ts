import { Meaning } from 'src/types/dictionaryApiResponce';
import { MeaningDto } from 'src/words/dto/meaning.dto';

function getMeanings(meanings: Meaning[]): MeaningDto[] {
  return meanings.map((meaning) => {
    const partOfSpeech = meaning.partOfSpeech;
    const synonyms = meaning.synonyms;
    const antonyms = meaning.antonyms;

    const definitions = meaning.definitions.map((definition) => {
      return {
        definition: definition.definition,
        example: definition.example ? definition.example : null,
      };
    });

    return {
      partOfSpeech,
      definitions,
      synonyms,
      antonyms,
    };
  });
}

export default getMeanings;
