import { MultipartFile } from '@fastify/multipart';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { pipeline } from 'stream/promises';
import { Photo } from './entities/photo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { rm } from 'fs/promises';

@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,
    private readonly configService: ConfigService,
  ) {}

  async savePhotoToLocalDirectory(
    fileUploadDirectory: string,
    multipartFile: MultipartFile,
    path: string,
  ) {
    if (!existsSync(fileUploadDirectory)) {
      console.log('File upload directory does not exist, creating...');
      mkdirSync(fileUploadDirectory);
    }

    await pipeline(multipartFile.file, createWriteStream(path));
  }

  async create(multipartFile: MultipartFile) {
    const fileUploadDirectory = this.configService.get('FILE_UPLOAD_DIR');
    const fileName = `${randomUUID()}-${multipartFile.filename}`;
    const path = join(fileUploadDirectory, fileName);

    await this.savePhotoToLocalDirectory(
      fileUploadDirectory,
      multipartFile,
      path,
    );

    const photo = new Photo();
    photo.filename = fileName;
    photo.url = path;

    return this.photoRepository.save(photo);
  }

  async update(id: number, multipartFile: MultipartFile) {
    const photo = await this.photoRepository.findOneBy({ id });

    if (!photo) {
      throw new NotFoundException('Photo not found');
    }
    const fileUploadDirectory = this.configService.get('FILE_UPLOAD_DIR');
    const fileName = `${randomUUID()}-${multipartFile.filename}`;
    const path = join(fileUploadDirectory, fileName);

    await this.savePhotoToLocalDirectory(
      fileUploadDirectory,
      multipartFile,
      path,
    );

    await rm(photo.url);

    photo.filename = fileName;
    photo.url = path;

    return this.photoRepository.save(photo);
  }
}
