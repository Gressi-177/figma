import { Column, Entity, PrimaryColumn } from 'typeorm';

export interface FileInfo {
  filename: string;
  size: number;
  mimetype: string;
  path: string;
}

@Entity('uploads')
export class Upload {
  @PrimaryColumn('varchar')
  id: string;

  @Column('varchar')
  name: string;

  @Column('datetime')
  uploadedAt: string;

  @Column('simple-json')
  files: FileInfo[];
}
