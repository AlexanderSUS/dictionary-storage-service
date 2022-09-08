import { IsEnum } from 'class-validator';
import { WordStatus } from 'src/const/enum';

export class UpdateWordDto {
  @IsEnum(WordStatus)
  status: WordStatus;
}
