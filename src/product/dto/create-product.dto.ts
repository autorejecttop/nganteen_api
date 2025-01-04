import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ProductType } from '../enums/product-type.enum';

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

  // TODO: Change to user entity
  @IsString()
  seller: string;
}
