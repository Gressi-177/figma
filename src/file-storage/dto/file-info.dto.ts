import { ApiProperty } from '@nestjs/swagger';

export class FileInfoDto {
  @ApiProperty({
    description: 'Original filename',
    example: 'data.json',
  })
  filename: string;

  @ApiProperty({
    description: 'File size in bytes',
    example: 1024,
  })
  size: number;

  @ApiProperty({
    description: 'MIME type of the file',
    example: 'application/json',
  })
  mimetype: string;

  @ApiProperty({
    description: 'Stored file path',
    example: 'uploads/123e4567-e89b-12d3-a456-426614174000/data.json',
  })
  path: string;
}

