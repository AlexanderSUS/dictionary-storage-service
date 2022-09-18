import { DefinitionDto } from './definition.dto';

export class MeaningDto {
  partOfSpeech: string;
  definitions: DefinitionDto[];
  synonyms: string[];
  antonyms: string[];
}
