import {
  IsEnum,
  IsNumberString,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { SordOrder, WordStatus } from 'src/const/enum';

export default class QueryDto {
  @IsEnum(WordStatus)
  @IsOptional()
  status?: WordStatus;

  @IsOptional()
  @IsString()
  exclude?: string;

  @IsOptional()
  @IsString()
  include?: string;

  @IsOptional()
  order?: SordOrder;

  @IsNumberString()
  @IsOptional()
  @IsPositive()
  limit?: string;

  @IsNumberString()
  @IsOptional()
  @IsPositive()
  offset?: string;
}
