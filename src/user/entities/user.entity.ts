import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserType } from '../enums/user-type.enum';
import { Exclude } from 'class-transformer';
import { Order } from 'src/order/entities/order.entity';
import { Product } from 'src/product/entities/product.entity';

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
  })
  products?: Product[];

  @OneToMany(() => Order, (order) => order.buyer, {
    cascade: true,
  })
  buyerOrders?: Order[];

  @OneToMany(() => Order, (order) => order.seller, {
    cascade: true,
  })
  sellerOrders?: Order[];
}
