import { Controller, Post, Request } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { createWriteStream } from 'fs';

@Controller('file-upload')
export class FileUploadController {
  @Post()
  async create(@Request() req: FastifyRequest) {
    const data = await req.file();

    await new Promise((resolve, reject) => {
      const stream = createWriteStream(data.filename);
      data.file.pipe(stream);
      stream.on('finish', resolve);
      stream.on('error', reject);
    });
    return;
  }
}
