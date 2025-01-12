import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Photo } from './entities/photo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Photo])],
  providers: [FileUploadService],
  exports: [FileUploadService],
})
export class FileUploadModule {}
