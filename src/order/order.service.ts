import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  create(createOrderDto: CreateOrderDto) {
    if (createOrderDto.buyer === createOrderDto.seller) {
      throw new BadRequestException('Buyer and seller cannot be the same');
    }

    return this.orderRepository.save(createOrderDto);
  }

  findAll() {
    return this.orderRepository.find({ relations: ['buyer', 'seller'] });
  }

  async findOne(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['buyer', 'seller'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.findOne(id);

    console.log(order);

    if (updateOrderDto.seller || updateOrderDto.buyer) {
      if (updateOrderDto.buyer === updateOrderDto.seller) {
        throw new BadRequestException('Buyer and seller cannot be the same');
      }
    }

    Object.assign(order, updateOrderDto);

    if (updateOrderDto.seller === (order.buyer.id as unknown as User)) {
      throw new BadRequestException('Buyer and seller cannot be the same');
    }

    if (updateOrderDto.buyer === (order.seller.id as unknown as User)) {
      throw new BadRequestException('Buyer and seller cannot be the same');
    }

    await this.orderRepository.save(order);

    return this.orderRepository.findOne({
      where: { id },
    });
  }

  async remove(id: number) {
    await this.orderRepository.delete(id);
  }
}
