import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';

import { FilesInterceptor } from '@nestjs/platform-express';

import { FilesService } from './files.service';

interface UploadQuery {
  folderPath?: string;
  mimeType?: string;
  isMultiple?: string | boolean;
  limit?: string | number;
}

interface UploadOptions {
  folder: string;
  mimeType: string;
  multiple: boolean;
  maxFiles: number;
}

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  /**
   * Generic file upload endpoint.
   *
   * Use this endpoint when a separate /files URL
   * is required.
   *
   * For business-specific uploads such as:
   * POST /users/profile-image
   *
   * prefer calling FilesService directly from
   * the UsersService.
   */
  @Post('upload')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FilesInterceptor('files'))
  async upload(
    @UploadedFiles()
    files: Express.Multer.File[],

    @Query()
    query: UploadQuery,
  ) {
    const options = this.parseUploadQuery(query);

    const uploadedFiles = await this.filesService.upload(files, options);

    return {
      status: true,

      message:
        uploadedFiles.length === 1
          ? 'File uploaded successfully'
          : 'Files uploaded successfully',

      data: uploadedFiles.length === 1 ? uploadedFiles[0] : uploadedFiles,
    };
  }

  /**
   * Delete a file.
   *
   * Example:
   * DELETE /files/users%2F123%2Fprofile/file.jpg
   */
  @Delete(':folder/:fileName')
  async delete(
    @Param('folder')
    folder: string,

    @Param('fileName')
    fileName: string,
  ) {
    await this.filesService.delete(folder, fileName);

    return {
      status: true,
      message: 'File deleted successfully',
    };
  }

  private parseUploadQuery(query: UploadQuery): UploadOptions {
    if (!query.folderPath || !query.folderPath.trim()) {
      throw new BadRequestException('folderPath is required');
    }

    if (!query.mimeType || !query.mimeType.trim()) {
      throw new BadRequestException('mimeType is required');
    }

    const mimeType = query.mimeType.trim().toLowerCase();

    const isMultiple = query.isMultiple === true || query.isMultiple === 'true';

    const limit = query.limit === undefined ? 1 : Number(query.limit);

    if (!Number.isInteger(limit) || limit < 1) {
      throw new BadRequestException('limit must be a positive integer');
    }

    /*
     * folderPath is normalized here, but the
     * FilesService performs the security validation
     * against traversal/path attacks.
     */
    const folder = query.folderPath
      .replace(/\\/g, '/')
      .replace(/^\/+/, '')
      .replace(/\/+$/, '');

    if (!folder) {
      throw new BadRequestException('Invalid folderPath');
    }

    return {
      folder,
      mimeType,
      multiple: isMultiple,
      maxFiles: limit,
    };
  }
}
