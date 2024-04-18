import { IsNotEmpty, IsString } from 'class-validator';
import { Status } from '../enum/status.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
  status: Status;
  createdAt: Date;
  udpatedAt: Date;
}
