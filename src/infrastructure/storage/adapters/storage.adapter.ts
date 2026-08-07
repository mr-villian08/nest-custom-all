import { UploadOptions } from '../interfaces/upload-options.interface';
import { UploadResult } from '../interfaces/upload-result.interface';

export abstract class StorageAdapter {
  abstract upload(
    files: unknown[],
    options: UploadOptions,
  ): Promise<UploadResult>;

  abstract delete(path: string): Promise<void>;

  abstract exists(path: string): Promise<boolean>;

  abstract move(from: string, to: string): Promise<void>;

  abstract copy(from: string, to: string): Promise<void>;

  abstract url(path: string): string;
}
