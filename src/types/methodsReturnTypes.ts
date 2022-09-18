import { User } from 'src/user/entities/user.entity';

export type UserWithoutPassword = Omit<User, 'password'>;
