import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/index';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Get()
  findAll() {
    return this.userService.findAllUsers();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id) {
    return this.userService.findOneUser(id);
  }
  @Post()
  async create(@Body() userDto: CreateUserDto) {
    const user: User = await this.userService.createUser(userDto);
    return { id: user.id, name: user.name, email: user.email };
  }
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id, @Body() userDto: UpdateUserDto) {
    return this.userService.updateUser(id, userDto);
  }
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: number) {
    return this.userService.removeUser(id);
  }
}
