import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserType } from '../enums/user-type.enum';
import { Exclude } from 'class-transformer';
import { Order } from 'src/order/entities/order.entity';
import { Product } from 'src/product/entities/product.entity';
import { Photo } from 'src/file-upload/entities/photo.entity';

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

  @OneToMany(() => Product, (product) => product.seller, {
    cascade: true,
    eager: true,
  })
  products?: Product[];

  @OneToMany(() => Order, (order) => order.buyer, {
    cascade: true,
    eager: true,
  })
  buyerOrders?: Order[];

  @OneToMany(() => Order, (order) => order.seller, {
    cascade: true,
    eager: true,
  })
  sellerOrders?: Order[];

  @OneToOne(() => Photo, {
    eager: true,
  })
  @JoinColumn()
  photo: Photo;
}
