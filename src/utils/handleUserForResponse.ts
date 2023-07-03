import { UserWithoutPassword } from 'src/types/methodsReturnTypes';
import { User } from 'src/user/entities/user.entity';

const handleUserForResponse = (user: User): UserWithoutPassword => {
  user.createdAt = new Date(user.createdAt).getTime();
  user.updatedAt = new Date(user.updatedAt).getTime();

  delete user.password;

  return user;
};

export default handleUserForResponse;
