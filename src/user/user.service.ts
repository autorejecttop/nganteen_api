import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...newUserData } = createUserDto;

    const isEmailUsed = await this.userRepository.existsBy({
      email: createUserDto.email,
    });

    if (isEmailUsed) {
      throw new BadRequestException('Email already in use');
    }

    const user = this.userRepository.create({
      passwordHash: await bcrypt.hash(
        password,
        +this.configService.get('SALT_ROUNDS'),
      ),
      ...newUserData,
    });

    const createdUser = await this.userRepository.save(user);
    return this.userRepository.findOne({
      where: { id: createdUser.id },
      relations: { products: true, buyerOrders: true, sellerOrders: true },
    });
  }

  findAll() {
    return this.userRepository.find({
      relations: { products: true, buyerOrders: true, sellerOrders: true },
    });
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {
        products: true,
        buyerOrders: true,
        sellerOrders: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    const { password, ...newUserData } = updateUserDto;

    Object.assign(user, {
      passwordHash: password
        ? await bcrypt.hash(password, +this.configService.get('SALT_ROUNDS'))
        : user.passwordHash,
      ...newUserData,
    });

    await this.userRepository.save(user);

    return this.userRepository.findOne({
      where: { id },
      relations: { products: true, buyerOrders: true, sellerOrders: true },
    });
  }

  async remove(id: number) {
    await this.userRepository.delete(id);
  }
}
