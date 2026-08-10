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

import { MaxFileSizeValidator, ParseFilePipe } from '@nestjs/common';

import {
  FILE_LIMITS,
  FILE_MIME_TYPES,
  FILE_TYPE,
  FileType,
} from './constants/file.constants';

import { FilesService } from './files.service';

interface UploadQuery {
  folderPath?: string;
  fileType?: string;
  isMultiple?: string | boolean;
  limit?: string | number;
}

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FilesInterceptor('files', FILE_LIMITS.MAX_FILES_PER_REQUEST, {
      limits: {
        fileSize: FILE_LIMITS.MAX_FILE_SIZE,
      },
    }),
  )
  async upload(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: FILE_LIMITS.MAX_FILE_SIZE,
          }),
        ],
      }),
    )
    files: Express.Multer.File[],

    @Query()
    query: UploadQuery,
  ) {
    const options = this.parseUploadQuery(query);

    /*
     * Validate actual MIME/content against the
     * requested file category.
     */
    this.validateFiles(files, options.fileType);

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

  private parseUploadQuery(query: UploadQuery) {
    if (!query.folderPath || !query.folderPath.trim()) {
      throw new BadRequestException('folderPath is required');
    }

    const fileType = query.fileType as FileType;

    if (!fileType || !Object.values(FILE_TYPE).includes(fileType)) {
      throw new BadRequestException(
        `fileType must be one of: ${Object.values(FILE_TYPE).join(', ')}`,
      );
    }

    const isMultiple = query.isMultiple === true || query.isMultiple === 'true';

    const limit = query.limit === undefined ? 3 : Number(query.limit);

    if (
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > FILE_LIMITS.MAX_FILES_PER_REQUEST
    ) {
      throw new BadRequestException(
        `limit must be between 1 and ${FILE_LIMITS.MAX_FILES_PER_REQUEST}`,
      );
    }

    return {
      folder: query.folderPath
        .replace(/\\/g, '/')
        .replace(/^\/+/, '')
        .replace(/\/+$/, ''),

      fileType,

      multiple: isMultiple,

      maxFiles: limit,
    };
  }

  private validateFiles(
    files: Express.Multer.File[],
    fileType: FileType,
  ): void {
    const allowedMimeTypes = FILE_MIME_TYPES[fileType];

    for (const file of files) {
      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException(
          `Invalid file type for ${fileType}. Allowed MIME types: ${allowedMimeTypes.join(', ')}`,
        );
      }
    }
  }
}
