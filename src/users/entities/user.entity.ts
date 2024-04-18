import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Status } from '../enum/status.enum';
import { hashPasswordTransform } from '../../common/helpers';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({
    transformer: hashPasswordTransform,
    nullable: false,
    select: false,
  })
  password: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.ACTIVED,
  })
  status: Status;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  udpatedAt: Date;
}
