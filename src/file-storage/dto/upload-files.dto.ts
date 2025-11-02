import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadFilesDto {
  @ApiProperty({
    description: 'Name for the uploaded file set',
    example: 'My Project Files',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}

