import { Meaning } from 'src/types/dictionaryApiResponce';
import { WordEntityMeaning } from 'src/types/textProcessing';

function getMeanings(meanings: Meaning[]): Array<WordEntityMeaning> {
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
