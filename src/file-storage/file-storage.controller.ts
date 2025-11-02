import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UploadDetailResponseDto } from './dto/upload-detail-response.dto';
import { UploadFilesDto } from './dto/upload-files.dto';
import { UploadResponseDto } from './dto/upload-response.dto';
import { FileStorageService } from './file-storage.service';
import { UploadedFile } from './types';

@ApiTags('File Storage')
@Controller('api/files')
export class FileStorageController {
  constructor(private readonly fileStorageService: FileStorageService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files', 3))
  @ApiOperation({
    summary: 'Upload 3 JSON files',
    description:
      'Upload exactly 3 JSON files along with a name for the file set. Returns a unique identifier for the uploaded set.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Exactly 3 JSON files to upload',
        },
        name: {
          type: 'string',
          description: 'Name for the uploaded file set',
          example: 'My Project Files',
        },
      },
      required: ['files', 'name'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Files uploaded successfully',
    type: UploadResponseDto,
  })
  @ApiResponse({
    status: 400,
    description:
      'Invalid request - missing files, invalid JSON, or wrong count',
  })
  async uploadFiles(
    @UploadedFiles() files: UploadedFile[],
    @Body() body: UploadFilesDto,
  ): Promise<UploadResponseDto> {
    if (!body.name) {
      throw new BadRequestException('Name field is required');
    }

    return this.fileStorageService.uploadFiles(files, body.name);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a specific upload by ID',
    description:
      'Retrieve the stored files and metadata for a specific upload using its unique identifier. Returns actual JSON content from each file.',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the upload',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Upload found and returned with actual file contents',
    type: UploadDetailResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Upload not found',
  })
  async getUpload(@Param('id') id: string): Promise<UploadDetailResponseDto> {
    return this.fileStorageService.getUpload(id);
  }

  @Get()
  @ApiOperation({
    summary: 'Get list of all uploads',
    description:
      'Retrieve a list of all uploaded file sets with their metadata.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of uploads returned',
    type: [UploadResponseDto],
  })
  async getUploads(): Promise<UploadResponseDto[]> {
    return this.fileStorageService.getUploads();
  }
}
