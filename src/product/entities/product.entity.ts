import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductType } from '../enums/product-type.enum';
import { User } from 'src/user/entities/user.entity';
import { Order } from 'src/order/entities/order.entity';
import { Photo } from 'src/file-upload/entities/photo.entity';

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

  @ManyToOne(() => User, (user) => user.products, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  seller: User;

  @OneToMany(() => Order, (order) => order.product, {
    cascade: true,
  })
  orders?: Order[];

  @OneToOne(() => Photo, {
    eager: true,
  })
  @JoinColumn()
  photo: Photo;
}
