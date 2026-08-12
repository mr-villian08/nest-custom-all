import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import type { ConfigType } from '@nestjs/config';

import * as fs from 'node:fs/promises';
import * as path from 'node:path';

import {
  StorageProvider,
  StorageUploadInput,
} from '../../../interfaces/storage-provider.interface';

import { UploadedFile } from '../../../interfaces/uploaded-file.interface';
import fileConfig from '../../../../config/file.config';

@Injectable()
export class LocalStorageService implements StorageProvider {
  constructor(
    @Inject(fileConfig.KEY)
    private readonly config: ConfigType<typeof fileConfig>,
  ) {}

  async upload(input: StorageUploadInput): Promise<UploadedFile> {
    const folder = this.normalizeFolder(input.folder);

    const directory = path.join(process.cwd(), this.config.root, folder);

    await fs.mkdir(directory, {
      recursive: true,
    });

    const filePath = path.join(directory, input.fileName);

    try {
      await fs.writeFile(filePath, input.file.buffer);
    } catch {
      throw new InternalServerErrorException('Unable to save uploaded file');
    }

    const storagePath = `${folder}/${input.fileName}`;

    return {
      originalName: input.file.originalname,

      fileName: input.fileName,

      mimeType: input.file.mimetype,

      size: input.file.size,

      path: storagePath,

      url: this.getPublicUrl(storagePath),
    };
  }

  async delete(folder: string, fileName: string): Promise<void> {
    const filePath = this.getAbsolutePath(folder, fileName);

    try {
      await fs.unlink(filePath);
    } catch (error) {
      if (
        error instanceof Error &&
        'code' in error &&
        error.code === 'ENOENT'
      ) {
        throw new NotFoundException('File does not exist');
      }

      throw new InternalServerErrorException('Unable to delete file');
    }
  }

  async exists(folder: string, fileName: string): Promise<boolean> {
    try {
      await fs.access(this.getAbsolutePath(folder, fileName));

      return true;
    } catch {
      return false;
    }
  }

  getAbsolutePath(folder: string, fileName: string): string {
    return path.join(
      process.cwd(),
      this.config.root,
      this.normalizeFolder(folder),
      fileName,
    );
  }

  getPublicUrl(storagePath: string): string {
    const baseUrl = this.config.serveUrl.replace(/\/+$/, '');

    const normalized = storagePath.replace(/\\/g, '/').replace(/^\/+/, '');

    return `${baseUrl}/${normalized}`;
  }

  private normalizeFolder(folder: string): string {
    const normalized = folder
      .replace(/\\/g, '/')
      .replace(/^\/+/, '')
      .replace(/\/+$/, '');

    if (
      !normalized ||
      normalized.includes('..') ||
      path.posix.isAbsolute(normalized)
    ) {
      throw new InternalServerErrorException('Invalid storage folder');
    }

    return normalized;
  }
}
