import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { PhotoModule } from 'src/photo/photo.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), PhotoModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
