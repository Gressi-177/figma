import { ApiProperty } from '@nestjs/swagger';
import { FileInfoDto } from './file-info.dto';

export class UploadResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the uploaded file set',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the uploaded file set',
    example: 'My Project Files',
  })
  name: string;

  @ApiProperty({
    description: 'Timestamp when files were uploaded',
    example: '2024-01-15T10:30:00Z',
  })
  uploadedAt: string;

  @ApiProperty({
    description: 'Array of uploaded files information',
    type: [FileInfoDto],
  })
  files: FileInfoDto[];
}

