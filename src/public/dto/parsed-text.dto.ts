import { PublicWordDto } from './public-word.dto';

export class ParsedTextDto {
  found: PublicWordDto[];
  notFound: string[];
}
