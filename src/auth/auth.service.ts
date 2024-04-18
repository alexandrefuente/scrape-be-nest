import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './auth.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    const user: User = await this.userService.getUserByName(username);
    if (user && user.password === password) {
      return user;
    }
    return null;
  }

  private isPasswordValid(password: string, userPassword): boolean {
    return bcrypt.compareSync(password, userPassword);
  }
  async login(body: LoginDto): Promise<{ accessToken: string }> {
    const { email, password }: LoginDto = body;
    const user = await this.userService.getUserByEmail(email);
    const isPasswordValid = this.isPasswordValid(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
