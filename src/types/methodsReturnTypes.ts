import { User } from 'src/user/entities/user.entity';

export type Tokens = {
  access_token: string;
  refresh_token: string;
};

export type SignUpOkMessage = {
  msg: string;
};

export type UserWithoutPassword = Omit<User, 'password'>;
