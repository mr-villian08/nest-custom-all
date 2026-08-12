import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import type { ConfigType } from '@nestjs/config';

import { randomUUID } from 'node:crypto';

import * as path from 'node:path';

import type { StorageProvider } from '../../interfaces/storage-provider.interface';

import { UploadedFile } from '../../interfaces/uploaded-file.interface';

import { FileValidationService } from './validation/file-validation.service';

import { MediaService } from './media/media.service';

import { STORAGE_PROVIDER } from '../../constants/file.token';

import fileConfig from '../../../config/file.config';

export interface UploadOptions {
  folder: string;

  mimeType: string;

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

    @Inject(fileConfig.KEY)
    private readonly config: ConfigType<typeof fileConfig>,
  ) {}

  async upload(
    files: Express.Multer.File[],
    options: UploadOptions,
  ): Promise<UploadedFile[]> {
    if (!files?.length) {
      throw new BadRequestException('No file uploaded');
    }

    this.validateOptions(options);

    if (!options.multiple && files.length > 1) {
      throw new BadRequestException('Only one file is allowed');
    }

    if (files.length > options.maxFiles) {
      throw new BadRequestException(
        `Maximum ${options.maxFiles} files are allowed`,
      );
    }

    const results: UploadedFile[] = [];

    for (const file of files) {
      const uploaded = await this.uploadSingle(file, options);

      results.push(uploaded);
    }

    return results;
  }

  async uploadSingle(
    file: Express.Multer.File,
    options: UploadOptions,
  ): Promise<UploadedFile> {
    this.validateOptions(options);

    await this.validationService.validate(file, options.mimeType);

    const extension = this.getSafeExtension(file.originalname);

    const fileName = `${randomUUID()}${extension}`;

    const uploaded = await this.storage.upload({
      file,
      folder: options.folder,
      fileName,
    });

    /*
     * Only try to extract duration for
     * audio/video MIME types.
     */
    if (this.isAudio(options.mimeType) || this.isVideo(options.mimeType)) {
      try {
        const absolutePath = this.storage.getAbsolutePath(
          options.folder,
          fileName,
        );

        uploaded.duration = await this.mediaService.getDuration(absolutePath);
      } catch {
        /*
         * File was successfully uploaded.
         * Metadata failure should not delete
         * the successfully uploaded file.
         */
        uploaded.duration = undefined;
      }
    }

    return uploaded;
  }

  async deleteByPath(storagePath: string): Promise<void> {
    const normalized = storagePath.replace(/\\/g, '/').replace(/^\/+/, '');

    const index = normalized.lastIndexOf('/');

    if (index === -1) {
      throw new BadRequestException('Invalid storage path');
    }

    const folder = normalized.substring(0, index);

    const fileName = normalized.substring(index + 1);

    await this.delete(folder, fileName);
  }

  async delete(folder: string, fileName: string): Promise<void> {
    this.validateFolder(folder);

    this.validateFileName(fileName);

    await this.storage.delete(folder, fileName);
  }

  getPublicUrl(storagePath: string | null): string | null {
    if (!storagePath) {
      return null;
    }

    return this.storage.getPublicUrl(storagePath);
  }

  private validateOptions(options: UploadOptions): void {
    this.validateFolder(options.folder);

    if (!options.mimeType?.trim()) {
      throw new BadRequestException('mimeType is required');
    }

    if (
      !Number.isInteger(options.maxFiles) ||
      options.maxFiles < 1 ||
      options.maxFiles > this.config.maxFiles
    ) {
      throw new BadRequestException(
        `maxFiles must be between 1 and ${this.config.maxFiles}`,
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

  private isAudio(mimeType: string): boolean {
    return mimeType.toLowerCase().startsWith('audio/');
  }

  private isVideo(mimeType: string): boolean {
    return mimeType.toLowerCase().startsWith('video/');
  }
}
