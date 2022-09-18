import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTextDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description:
      'Any text. It will be broken in to words, and for each word app will try to find description',
    example: 'The journey of a thousand miles begins with one step.',
    type: String,
  })
  text: string;
}
