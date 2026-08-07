import { StorageDriver } from '../enums/storage-driver.enum';

export interface UploadedFile {
  storage: StorageDriver;

  name: string;

  originalName: string;

  extension: string;

  mimeType: string;

  size: number;

  path: string;

  relativePath: string;

  url: string;

  visibility: string;

  checksum?: string;

  width?: number;

  height?: number;

  duration?: number;
}
