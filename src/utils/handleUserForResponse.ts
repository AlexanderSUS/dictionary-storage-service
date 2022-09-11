import { User } from 'src/user/entities/user.entity';

const handleUserForResonse = (user: User) => {
  user.createdAt = new Date(user.createdAt).getTime();
  user.updatedAt = new Date(user.updatedAt).getTime();

  delete user.password;

  return user;
};

export default handleUserForResonse;
