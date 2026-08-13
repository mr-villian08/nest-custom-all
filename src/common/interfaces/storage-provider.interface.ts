import 'multer';
import { UploadedFile } from './uploaded-file-interface';

export interface StorageUploadInput {
  file: Express.Multer.File;

  folder: string;

  fileName: string;
}

export interface StorageProvider {
  upload(input: StorageUploadInput): Promise<UploadedFile>;

  delete(folder: string, fileName: string): Promise<void>;

  exists(folder: string, fileName: string): Promise<boolean>;

  getAbsolutePath(folder: string, fileName: string): string;

  getPublicUrl(storagePath: string): string;
}
