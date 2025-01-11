import { Controller, Post, Request } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { FileUploadService } from './file-upload.service';

@Controller('file-upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post()
  async create(@Request() req: FastifyRequest) {
    this.fileUploadService.create(await req.file());
  }
}
