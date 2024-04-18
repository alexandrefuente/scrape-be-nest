import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  /**
   * create a new user
   * @param userDto
   * @returns promise of user
   */
  async createUser(userDto: CreateUserDto): Promise<User> {
    const user: User = new User();
    user.name = userDto.name;
    user.email = userDto.email;
    user.password = userDto.password;
    return this.userRepository.save(user);
  }

  /**
   * get all user from database
   * @returns promise of array of users
   */
  async findAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  /**
   * get data from user by ID
   * @param id
   * @returns User by id
   */
  async findOneUser(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    return user;
  }

  /**
   * udpate user data wiht new data info
   * @param id
   * @param userDto
   * @returns update user data
   */
  async updateUser(id: number, userDto: UpdateUserDto): Promise<User> {
    await this.userRepository.update(id, userDto);
    return this.userRepository.findOne({ where: { id } });
  }

  /**
   * delete user from database
   * @param id
   * @returns number the row affetcted
   */
  async removeUser(id: number): Promise<boolean> {
    if (this.userRepository.delete(id)) {
      return true;
    }
    return false;
  }

  async getUserByName(name: string): Promise<User> {
    const user = await this.userRepository.findOne({
      select: { name: true, email: true, password: true },
      where: { name },
    });
    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
      where: { email },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
