import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;

  const userRepositoryToken = getRepositoryToken(User);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: userRepositoryToken,
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(userRepositoryToken);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return NotFoundException if user does not exist', async () => {
    const newUserId = 1;

    jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(undefined);
    try {
      await service.findOneUser(newUserId);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
    }

    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { id: newUserId },
    });
  });
  it('should return a user', async () => {
    const newUserId = 1;
    const existingUser = {
      id: 1,
      name: 'User One',
      email: 'useone@email.com',
      password: 'b@l1l@A!c',
    } as User;

    jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(existingUser);
    const result = await service.findOneUser(newUserId);

    expect(result).toBeDefined();
    expect(result.name).toEqual(existingUser.name);
    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { id: newUserId },
    });
  });
  it('should create a user', async () => {
    const userDto = {
      id: 1,
      name: 'User One',
      email: 'useone@email.com',
      password: 'b@l1l@A!c',
    } as User;

    jest.spyOn(userRepository, 'save').mockResolvedValueOnce(userDto);
    const result = await service.createUser(userDto);
    expect(result).toBeDefined();
    expect(result.name).toEqual(userDto.name);
  });
  it('should return a list of users', async () => {
    const userOneDto = {
      id: 1,
      name: 'User One',
      email: 'useone@email.com',
      password: 'b@l1l@A!c',
    } as User;

    const userTwoDto = {
      id: 2,
      name: 'User Two',
      email: 'usertwo@email.com',
      password: 'b@l1l@A!c',
    } as User;

    jest.spyOn(userRepository, 'save').mockResolvedValueOnce(userOneDto);
    await service.createUser(userOneDto);
    jest.spyOn(userRepository, 'save').mockResolvedValueOnce(userTwoDto);
    await service.createUser(userTwoDto);
    jest
      .spyOn(userRepository, 'find')
      .mockResolvedValueOnce([userOneDto, userTwoDto]);
    const result = await service.findAllUsers();
    expect(result).toBeDefined();
    expect(result.length).toBe(2);

    expect(result[1].name).toEqual(userTwoDto.name);
  });
  it('should return an array empty', async () => {
    jest.spyOn(userRepository, 'find').mockResolvedValueOnce([]);
    const result = await service.findAllUsers();
    expect(result).toBeDefined();
    expect(result.length).toBe(0);
  });

  it('should delete a user', async () => {
    const userDto = {
      id: 1,
      name: 'User One',
      email: 'useone@email.com',
      password: 'b@l1l@A!c',
    } as User;

    jest.spyOn(userRepository, 'save').mockResolvedValueOnce(userDto);
    await service.createUser(userDto);
    jest.spyOn(userRepository, 'delete').mockResolvedValueOnce(null);
    const result = await service.removeUser(userDto.id);
    expect(result).toBe(true);
    expect(result).toBeDefined();
  });

  it('should create a user', async () => {
    const userDto = {
      id: 1,
      name: 'User One',
      email: 'useone@email.com',
      password: 'b@l1l@A!c',
    } as User;

    jest.spyOn(userRepository, 'save').mockResolvedValueOnce(userDto);
    await service.createUser(userDto);
    const userUpdate = {
      ...userDto,
      name: 'User Update',
    } as User;
    jest
      .spyOn(userRepository, 'update')
      .mockResolvedValueOnce(userUpdate as any);
    jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(userUpdate);
    const result = await service.updateUser(userDto.id, userUpdate);
    expect(result).toBeDefined();
    expect(result.name).not.toEqual(userDto.name);
    expect(result.name).toEqual(userUpdate.name);
  });
});
