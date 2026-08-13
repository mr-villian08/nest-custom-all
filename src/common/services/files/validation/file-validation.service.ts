import {
  BadRequestException,
  Injectable,
  PayloadTooLargeException,
} from '@nestjs/common';

import { Inject } from '@nestjs/common';

import type { ConfigType } from '@nestjs/config';

import fileConfig from '../../../../config/file.config';

@Injectable()
export class FileValidationService {
  constructor(
    @Inject(fileConfig.KEY)
    private readonly config: ConfigType<typeof fileConfig>,
  ) {}

  async validate(
    file: Express.Multer.File,
    requestedMimeType: string,
  ): Promise<void> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const mimeType = requestedMimeType.trim().toLowerCase();

    this.validateMimeTypeIsAllowed(mimeType);

    this.validateFileSize(file);

    this.validateUploadedMimeType(file, mimeType);

    await this.validateFileContent(file, mimeType);
  }

  private validateMimeTypeIsAllowed(mimeType: string): void {
    if (!this.config.allowedMimeTypes.includes(mimeType)) {
      throw new BadRequestException(`File type '${mimeType}' is not allowed`);
    }
  }

  private validateFileSize(file: Express.Multer.File): void {
    if (file.size > this.config.maxSize) {
      throw new PayloadTooLargeException(
        `File size cannot exceed ${this.config.maxSize} bytes`,
      );
    }
  }

  private validateUploadedMimeType(
    file: Express.Multer.File,
    requestedMimeType: string,
  ): void {
    const uploadedMimeType = file.mimetype.trim().toLowerCase();

    if (uploadedMimeType !== requestedMimeType) {
      throw new BadRequestException(
        `File MIME type mismatch. Expected '${requestedMimeType}', received '${uploadedMimeType}'`,
      );
    }
  }

  private async validateFileContent(
    file: Express.Multer.File,
    requestedMimeType: string,
  ): Promise<void> {
    const { fileTypeFromBuffer } = await import('file-type');
    const detected = await fileTypeFromBuffer(file.buffer);

    /*
     * Some file formats do not have a
     * detectable binary signature.
     *
     * Example:
     * text/csv
     * text/plain
     */
    if (!detected) {
      return;
    }

    if (detected.mime !== requestedMimeType) {
      throw new BadRequestException(
        `File content does not match MIME type '${requestedMimeType}'`,
      );
    }
  }
}
