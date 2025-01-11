import { MultipartFile } from '@fastify/multipart';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { pipeline } from 'stream/promises';

@Injectable()
export class FileUploadService {
  constructor(private readonly configService: ConfigService) {}

  async create(multipartFile: MultipartFile) {
    const fileUploadDirectory = this.configService.get('FILE_UPLOAD_DIR');

    if (!existsSync(fileUploadDirectory)) {
      console.log('File upload directory does not exist, creating...');
      mkdirSync(fileUploadDirectory);
    }

    const fileName = `${randomUUID()}-${multipartFile.filename}`;

    const path = join(fileUploadDirectory, fileName);

    await pipeline(multipartFile.file, createWriteStream(path));
  }
}
