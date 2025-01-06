import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductType } from '../enums/product-type.enum';
import { User } from 'src/user/entities/user.entity';
import { Order } from 'src/order/entities/order.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'decimal',
  })
  price: number;

  @Column({
    nullable: true,
    type: 'float',
  })
  rating?: number;

  @Column({
    type: 'enum',
    enum: ProductType,
  })
  type: ProductType;

  @Column({
    type: 'text',
  })
  description: string;

  @ManyToOne(() => User, (user) => user.products)
  seller: User;

  @OneToMany(() => Order, (order) => order.product)
  orders?: Order[];
}
