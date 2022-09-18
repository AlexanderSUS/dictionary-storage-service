import { ApiProperty } from '@nestjs/swagger';

export default class TokensDto {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  refresh_token: string;
}
