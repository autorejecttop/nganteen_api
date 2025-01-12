import { Product } from '../../../src/product/entities/product.entity';
import { User } from '../../../src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OrderStatus } from '../enums/order-status.enum';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.buyerOrders, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  buyer: User;

  @ManyToOne(() => User, (user) => user.sellerOrders, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  seller: User;

  @ManyToOne(() => Product, (product) => product.orders, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    eager: true,
  })
  product: Product;

  @Column()
  quantity: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;
}
