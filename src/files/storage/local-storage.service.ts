import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import * as fs from 'node:fs/promises';
import * as path from 'node:path';

import {
  StorageProvider,
  StorageUploadInput,
} from '../interfaces/storage-provider.interface';

import { UploadedFile } from '../interfaces/uploaded-file.interface';

@Injectable()
export class LocalStorageService implements StorageProvider {
  private readonly rootDirectory: string;

  private readonly serveUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.rootDirectory = this.configService.get<string>(
      'NODE_APP_FILES_ROOT',
      'public',
    );

    this.serveUrl = this.configService.get<string>(
      'NODE_APP_FILES_SERVE_URL',
      '',
    );
  }

  async upload(input: StorageUploadInput): Promise<UploadedFile> {
    const safeFolder = this.normalizeFolder(input.folder);

    const directory = path.join(process.cwd(), this.rootDirectory, safeFolder);

    await fs.mkdir(directory, {
      recursive: true,
    });

    const filePath = path.join(directory, input.fileName);

    try {
      await fs.writeFile(filePath, input.file.buffer);
    } catch {
      throw new InternalServerErrorException('Unable to save uploaded file');
    }

    const relativePath = path
      .join(this.rootDirectory, safeFolder, input.fileName)
      .replace(/\\/g, '/');

    return {
      originalName: input.file.originalname,

      fileName: input.fileName,

      mimeType: input.file.mimetype,

      size: input.file.size,

      path: relativePath,

      url: this.buildUrl(safeFolder, input.fileName),
    };
  }

  async delete(folder: string, fileName: string): Promise<void> {
    const filePath = this.getAbsolutePath(folder, fileName);

    try {
      await fs.unlink(filePath);
    } catch (error) {
      if (this.isNodeError(error) && error.code === 'ENOENT') {
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
      this.rootDirectory,
      this.normalizeFolder(folder),
      fileName,
    );
  }

  private buildUrl(folder: string, fileName: string): string {
    const baseUrl = this.serveUrl.replace(/\/+$/, '');

    return `${baseUrl}/${folder}/${fileName}`;
  }

  private normalizeFolder(folder: string): string {
    const normalized = folder
      .replace(/\\/g, '/')
      .replace(/^\/+/, '')
      .replace(/\/+$/, '');

    if (!normalized || normalized === '.' || normalized.includes('..')) {
      throw new InternalServerErrorException('Invalid storage folder');
    }

    return normalized;
  }

  private isNodeError(error: unknown): error is NodeJS.ErrnoException {
    return error instanceof Error;
  }
}
