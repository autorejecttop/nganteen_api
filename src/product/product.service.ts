import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { MultipartFile } from '@fastify/multipart';
import { FileUploadService } from '../../src/file-upload/file-upload.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly fileUploadService: FileUploadService,
  ) {}

  create(createProductDto: CreateProductDto) {
    return this.productRepository.save(createProductDto);
  }

  findAll() {
    return this.productRepository.find({
      relations: ['seller'],
    });
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['seller'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);

    Object.assign(product, updateProductDto);
    await this.productRepository.update(id, updateProductDto);

    return product;
  }

  async remove(id: number) {
    await this.productRepository.delete(id);
  }

  async uploadAndUpdatePhoto(id: number, file: MultipartFile) {
    const product = await this.findOne(id);

    const productPhoto = await this.fileUploadService.create(file);

    product.photo = productPhoto;

    return this.productRepository.save(product);
  }
}
