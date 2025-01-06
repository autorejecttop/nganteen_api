import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserType } from '../enums/user-type.enum';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  phoneNumber: string;

  @Column()
  email: string;

  @Exclude()
  @Column()
  passwordHash: string;

  @Column({
    type: 'enum',
    enum: UserType,
  })
  type: UserType;

  @Column({
    nullable: true,
  })
  nim?: string;

  // TODO: One-to-Many orders, both for buyers and sellers
  @Column({
    nullable: true,
  })
  orders?: string;
}
