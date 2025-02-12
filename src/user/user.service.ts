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
import { MultipartFile } from '@fastify/multipart';
import { PhotoService } from 'src/photo/photo.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly photoService: PhotoService,
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
    });
  }

  findAll() {
    return this.userRepository.find({});
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
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
    });
  }

  async remove(id: number) {
    await this.userRepository.delete(id);
  }

  async uploadPhoto(id: number, file: MultipartFile) {
    const user = await this.findOne(id);

    const userPhoto = await this.photoService.create(file);

    user.photo = userPhoto;

    return this.userRepository.save(user);
  }

  async updatePhoto(id: number, file: MultipartFile) {
    const user = await this.findOne(id);

    if (!user.photo) {
      throw new NotFoundException('Photo not found');
    }

    const photo = await this.photoService.update(user.photo.id, file);
    user.photo = photo;

    return this.userRepository.save(user);
  }
}
