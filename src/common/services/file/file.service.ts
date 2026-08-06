import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class FileService {
  // ? ********************** Get the size of a file in human-readable format ********************** */
  getFileSize(path: string): string | null {
    if (!fs.existsSync(path)) {
      return null;
    }

    const bytes = fs.statSync(path).size;

    if (bytes >= 1073741824) {
      return (bytes / 1073741824).toFixed(2) + ' GB';
    }

    if (bytes >= 1048576) {
      return (bytes / 1048576).toFixed(2) + ' MB';
    }

    if (bytes >= 1024) {
      return (bytes / 1024).toFixed(2) + ' KB';
    }

    return `${bytes} bytes`;
  }
}
