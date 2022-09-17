import { User } from 'src/user/entities/user.entity';
import { NormalizedUserWord } from './textProcessing';

export type Tokens = {
  access_token: string;
  refresh_token: string;
};

export type SignUpOkMessage = {
  msg: string;
};

export type UserWithoutPassword = Omit<User, 'password'>;

export type TextPostAuthResponse = {
  newWords: NormalizedUserWord[];
  notFound: string[];
};
