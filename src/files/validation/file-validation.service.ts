import { BadRequestException, Injectable } from '@nestjs/common';

import {
  FILE_MIME_TYPES,
  FILE_TYPE,
  FileType,
} from '../constants/file.constants';

@Injectable()
export class FileValidationService {
  validate(file: Express.Multer.File, fileType: FileType): void {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const allowedTypes = FILE_MIME_TYPES[fileType];

    if (!allowedTypes) {
      throw new BadRequestException(`Unsupported file type: ${fileType}`);
    }

    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(`Invalid ${fileType} file type`);
    }
  }

  isMediaType(fileType: FileType): boolean {
    return fileType === FILE_TYPE.AUDIO || fileType === FILE_TYPE.VIDEO;
  }
}
