import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  TableInheritance,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
@TableInheritance({
  column: {
    type: 'varchar',
    name: 'userType',
  },
})
export abstract class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  phoneNumber: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  passwordHash: string;

  @Column('varchar')
  userType: string;
}
