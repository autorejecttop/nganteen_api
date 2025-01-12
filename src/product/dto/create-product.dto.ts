import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ProductType } from '../enums/product-type.enum';
import { User } from '../../../src/user/entities/user.entity';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsEnum(ProductType)
  type: ProductType;

  @IsString()
  description: string;

  @IsNumber()
  seller: User;
}
