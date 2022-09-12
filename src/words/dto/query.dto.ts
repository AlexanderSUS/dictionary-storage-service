import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';
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
  limit?: string;

  @IsNumberString()
  @IsOptional()
  offset?: string;
}
