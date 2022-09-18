import { IsNotEmpty, IsString } from 'class-validator';

export default class RefreshDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
