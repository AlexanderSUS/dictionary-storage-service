import { ApiProperty } from '@nestjs/swagger';
import { ModifiedUserWordDto } from 'src/words/dto/modified-user-word.dto';

export class TextResponseDto {
  @ApiProperty({
    description: 'Array of words with description',
    isArray: true,
    type: ModifiedUserWordDto,
  })
  newWords: ModifiedUserWordDto[];

  @ApiProperty({
    description: 'List of words that application could not find via API',
    type: String,
    isArray: true,
  })
  notFound: string[];
}
