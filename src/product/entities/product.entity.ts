import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ProductType } from '../enums/product-type.enum';

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
  rating: number;

  @Column({
    type: 'enum',
    enum: ProductType,
  })
  type: ProductType;

  @Column({
    type: 'text',
  })
  description: string;

  // TODO: Many to one User entity
  @Column()
  seller: string;
}
