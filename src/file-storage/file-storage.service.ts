import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { FileInfoDto } from './dto/file-info.dto';
import { UploadDetailResponseDto } from './dto/upload-detail-response.dto';
import { UploadResponseDto } from './dto/upload-response.dto';
import { Upload } from './entities/upload.entity';
import { UploadedFile } from './types';

@Injectable()
export class FileStorageService {
  private readonly uploadsDir = path.join(process.cwd(), 'uploads');

  constructor(
    @InjectRepository(Upload)
    private readonly uploadRepository: Repository<Upload>,
  ) {
    this.ensureUploadsDirectory();
  }

  private ensureUploadsDirectory(): void {
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  private validateJsonFile(buffer: Buffer): void {
    try {
      JSON.parse(buffer.toString());
    } catch {
      throw new BadRequestException('File is not valid JSON');
    }
  }

  private readFileContent(filePath: string): any {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(fileContent);
    } catch (error) {
      throw new BadRequestException(
        `Failed to read or parse file ${filePath}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async uploadFiles(
    files: UploadedFile[],
    name: string,
  ): Promise<UploadResponseDto> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    if (files.length !== 3) {
      throw new BadRequestException('Exactly 3 files must be provided');
    }

    // Validate all files are JSON
    files.forEach((file: UploadedFile) => {
      if (!file.originalname.endsWith('.json')) {
        throw new BadRequestException(
          `File ${file.originalname} must have .json extension`,
        );
      }
      this.validateJsonFile(file.buffer);
    });

    const uploadId = uuidv4();
    const uploadDir = path.join(this.uploadsDir, uploadId);

    fs.mkdirSync(uploadDir, { recursive: true });

    const storedFiles: FileInfoDto[] = [];

    try {
      for (const file of files) {
        const filePath = path.join(uploadDir, file.originalname);
        fs.writeFileSync(filePath, file.buffer);

        storedFiles.push({
          filename: file.originalname,
          size: file.size,
          mimetype: file.mimetype,
          path: path.relative(process.cwd(), filePath),
        });
      }

      const uploadedAt = new Date().toISOString();
      const upload = this.uploadRepository.create({
        id: uploadId,
        name,
        uploadedAt,
        files: storedFiles,
      });

      await this.uploadRepository.save(upload);

      return {
        id: uploadId,
        name,
        uploadedAt,
        files: storedFiles,
      };
    } catch {
      if (fs.existsSync(uploadDir)) {
        fs.rmSync(uploadDir, { recursive: true });
      }
      throw new BadRequestException('Failed to save files');
    }
  }

  async getUpload(id: string): Promise<UploadDetailResponseDto> {
    const upload = await this.uploadRepository.findOne({ where: { id } });

    if (!upload) {
      throw new NotFoundException(`Upload with ID ${id} not found`);
    }

    // Read actual JSON content from each file
    const filesContent: Record<string, any> = {};

    for (const fileInfo of upload.files) {
      const absolutePath = path.join(process.cwd(), fileInfo.path);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      filesContent[fileInfo.filename] = this.readFileContent(absolutePath);
    }

    return {
      id: upload.id,
      name: upload.name,
      uploadedAt: upload.uploadedAt,
      files: filesContent,
    };
  }

  async getUploads(): Promise<UploadResponseDto[]> {
    const uploads = await this.uploadRepository.find();
    return uploads.map((upload) => ({
      id: upload.id,
      name: upload.name,
      uploadedAt: upload.uploadedAt,
      files: upload.files,
    }));
  }
}
