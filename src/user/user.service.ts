import { Injectable } from '@nestjs/common';
import { CreateBuyerDto } from './dto/create-buyer.dto';
import { UpdateBuyerDto } from './dto/update-buyer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Buyer } from './entities/buyer.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async create(createBuyerDto: CreateBuyerDto) {
    const newBuyer = new Buyer();

    newBuyer.userType = createBuyerDto.userType;
    newBuyer.name = createBuyerDto.name;
    newBuyer.phoneNumber = createBuyerDto.phoneNumber;
    newBuyer.email = createBuyerDto.email;
    newBuyer.passwordHash = await bcrypt.hash(
      createBuyerDto.password,
      +this.configService.get('SALT_ROUNDS'),
    );
    newBuyer.nim = createBuyerDto.nim;

    return this.userRepository.save(newBuyer);
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateBuyerDto: UpdateBuyerDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
