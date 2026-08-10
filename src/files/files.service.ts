import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { randomUUID } from 'node:crypto';

import * as path from 'node:path';

import { FILE_LIMITS, FILE_TYPE, FileType } from './constants/file.constants';

import type { StorageProvider } from './interfaces/storage-provider.interface';

import { UploadedFile } from './interfaces/uploaded-file.interface';

import { FileValidationService } from './validation/file-validation.service';

import { MediaService } from './media/media.service';

import { STORAGE_PROVIDER } from './constants/file.token';

export interface UploadOptions {
  folder: string;

  fileType: FileType;

  multiple: boolean;

  maxFiles: number;
}

@Injectable()
export class FilesService {
  constructor(
    @Inject(STORAGE_PROVIDER)
    private readonly storage: StorageProvider,

    private readonly validationService: FileValidationService,

    private readonly mediaService: MediaService,
  ) {}

  async upload(
    files: Express.Multer.File[],
    options: UploadOptions,
  ): Promise<UploadedFile[]> {
    if (!files?.length) {
      throw new BadRequestException('No file uploaded');
    }

    this.validateUploadOptions(options);

    if (!options.multiple && files.length > 1) {
      throw new BadRequestException('Only one file is allowed');
    }

    if (files.length > options.maxFiles) {
      throw new BadRequestException(
        `Maximum ${options.maxFiles} files are allowed`,
      );
    }

    const uploadedFiles: UploadedFile[] = [];

    for (const file of files) {
      const uploadedFile = await this.uploadSingle(file, options);

      uploadedFiles.push(uploadedFile);
    }

    return uploadedFiles;
  }

  async delete(folder: string, fileName: string): Promise<void> {
    this.validateFolder(folder);
    this.validateFileName(fileName);

    await this.storage.delete(folder, fileName);
  }

  async exists(folder: string, fileName: string): Promise<boolean> {
    this.validateFolder(folder);
    this.validateFileName(fileName);

    return this.storage.exists(folder, fileName);
  }

  private async uploadSingle(
    file: Express.Multer.File,
    options: UploadOptions,
  ): Promise<UploadedFile> {
    this.validationService.validate(file, options.fileType);

    const extension = this.getSafeExtension(file.originalname);

    const fileName = `${randomUUID()}${extension}`;

    const uploadedFile = await this.storage.upload({
      file,
      folder: options.folder,
      fileName,
    });

    if (this.validationService.isMediaType(options.fileType)) {
      await this.addMediaDuration(uploadedFile, options.folder, fileName);
    }

    return uploadedFile;
  }

  private async addMediaDuration(
    uploadedFile: UploadedFile,
    folder: string,
    fileName: string,
  ): Promise<void> {
    try {
      const absolutePath = this.storage.getAbsolutePath(folder, fileName);

      uploadedFile.duration = await this.mediaService.getDuration(absolutePath);
    } catch {
      /*
       * File upload already succeeded.
       *
       * Do not fail the entire request merely
       * because metadata extraction failed.
       */
      uploadedFile.duration = undefined;
    }
  }

  private validateUploadOptions(options: UploadOptions): void {
    this.validateFolder(options.folder);

    if (!Object.values(FILE_TYPE).includes(options.fileType)) {
      throw new BadRequestException('Invalid file type');
    }

    if (
      !Number.isInteger(options.maxFiles) ||
      options.maxFiles < 1 ||
      options.maxFiles > FILE_LIMITS.MAX_FILES_PER_REQUEST
    ) {
      throw new BadRequestException(
        `maxFiles must be between 1 and ${FILE_LIMITS.MAX_FILES_PER_REQUEST}`,
      );
    }
  }

  private validateFolder(folder: string): void {
    const normalized = folder
      .replace(/\\/g, '/')
      .replace(/^\/+/, '')
      .replace(/\/+$/, '');

    if (
      !normalized ||
      normalized.includes('..') ||
      path.posix.isAbsolute(normalized)
    ) {
      throw new BadRequestException('Invalid upload folder');
    }
  }

  private validateFileName(fileName: string): void {
    if (
      !fileName ||
      fileName.includes('/') ||
      fileName.includes('\\') ||
      fileName.includes('..')
    ) {
      throw new BadRequestException('Invalid file name');
    }
  }

  private getSafeExtension(originalName: string): string {
    const extension = path.extname(originalName);

    if (!extension || !/^\.[a-zA-Z0-9]+$/.test(extension)) {
      return '';
    }

    return extension.toLowerCase();
  }
}
