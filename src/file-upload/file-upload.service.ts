import { MultipartFile } from '@fastify/multipart';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { pipeline } from 'stream/promises';
import { Photo } from './entities/photo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FileUploadService {
  constructor(
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,
    private readonly configService: ConfigService,
  ) {}

  async create(multipartFile: MultipartFile) {
    const fileUploadDirectory = this.configService.get('FILE_UPLOAD_DIR');

    if (!existsSync(fileUploadDirectory)) {
      console.log('File upload directory does not exist, creating...');
      mkdirSync(fileUploadDirectory);
    }

    const fileName = `${randomUUID()}-${multipartFile.filename}`;

    const path = join(fileUploadDirectory, fileName);

    await pipeline(multipartFile.file, createWriteStream(path));

    const photo = new Photo();
    photo.filename = fileName;
    photo.url = path;

    return this.photoRepository.save(photo);
  }
}
