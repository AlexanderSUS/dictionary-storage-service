import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import handleUserForResponse from 'src/utils/handleUserForResponse';
import { UserWithoutPassword } from 'src/types/methodsReturnTypes';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(userDto: CreateUserDto): Promise<UserWithoutPassword> {
    const existedUser = await this.userRepository.findOneBy({
      login: userDto.login,
    });

    if (existedUser) {
      throw new HttpException(
        'User with given login does already exist',
        HttpStatus.CONFLICT,
      );
    }

    const user = await this.userRepository.save(userDto);

    return handleUserForResponse(user);
  }

  async findAll(): Promise<UserWithoutPassword[]> {
    const users = await this.userRepository.find();

    return users.map((user) => handleUserForResponse(user));
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    return handleUserForResponse(user);
  }

  async findOneByLogin(login: string) {
    const user = await this.userRepository.findOneBy({ login });

    if (!user) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async updateRefreshToken(id: string, refreshTokenHash: string) {
    const user = await this.userRepository.findOneBy({ id });

    await this.userRepository.save({ ...user, refreshTokenHash });
  }

  async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (updatePasswordDto.oldPassword !== user.password) {
      throw new HttpException('Old password is wrong', HttpStatus.FORBIDDEN);
    }

    const updatedUser = await this.userRepository.save({
      ...user,
      password: updatePasswordDto.newPassword,
    });

    return handleUserForResponse(updatedUser);
  }

  async remove(id: string) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.userRepository.remove(user);
  }
}
