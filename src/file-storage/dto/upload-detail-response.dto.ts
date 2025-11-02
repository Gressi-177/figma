import { ApiProperty } from '@nestjs/swagger';

export class UploadDetailResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the uploaded file set',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the uploaded file set',
    example: 'Design System',
  })
  name: string;

  @ApiProperty({
    description: 'Timestamp when files were uploaded',
    example: '2024-01-15T10:30:00Z',
  })
  uploadedAt: string;

  @ApiProperty({
    description: 'Object containing actual JSON content from each file',
    example: {
      'colors.json': { primary: '#FF0000', secondary: '#00FF00' },
      'components.json': { button: { size: 'md' }, card: { padding: '16px' } },
      'typographys.json': { heading: { size: '24px' }, body: { size: '14px' } },
    },
    additionalProperties: true,
  })
  files: Record<string, any>;
}
