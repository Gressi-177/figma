import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Upload } from './entities/upload.entity';
import { FileStorageController } from './file-storage.controller';
import { FileStorageService } from './file-storage.service';

@Module({
  imports: [TypeOrmModule.forFeature([Upload])],
  controllers: [FileStorageController],
  providers: [FileStorageService],
})
export class FileStorageModule {}
