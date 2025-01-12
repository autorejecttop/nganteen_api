import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { Product } from '../../../src/product/entities/product.entity';
import { User } from '../../../src/user/entities/user.entity';
import { OrderStatus } from '../enums/order-status.enum';

export class CreateOrderDto {
  @IsNumber()
  buyer: User;

  @IsNumber()
  seller: User;

  @IsNumber()
  product: Product;

  @IsNumber()
  quantity: number;

  @IsEnum(OrderStatus)
  @IsOptional()
  status: OrderStatus;
}
