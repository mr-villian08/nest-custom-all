import type { Request } from 'express';

import { FileNameStrategy } from '../enums/file-name-strategy.enum';
import { FileType } from '../enums/file-type.enum';
import { FileVisibility } from '../enums/file-visibility.enum';
import { StorageDriver } from '../enums/storage-driver.enum';

export interface UploadOptions {
  driver?: StorageDriver;

  fieldName: string;

  folder: string | ((request: Request) => string | Promise<string>);

  visibility?: FileVisibility;

  fileType?: FileType;

  strategy?: FileNameStrategy;

  customName?: string | ((originalName: string) => string | Promise<string>);

  multiple?: boolean;

  maxFiles?: number;

  maxFileSize?: number;

  allowedMimeTypes?: string[];

  allowedExtensions?: string[];

  generateThumbnail?: boolean;

  calculateDuration?: boolean;

  overwrite?: boolean;
}
