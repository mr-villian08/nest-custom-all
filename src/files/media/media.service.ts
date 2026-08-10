import { Injectable, InternalServerErrorException } from '@nestjs/common';

import ffmpeg from 'fluent-ffmpeg';

@Injectable()
export class MediaService {
  async getDuration(filePath: string): Promise<number | undefined> {
    try {
      return await new Promise<number | undefined>((resolve, reject) => {
        ffmpeg.ffprobe(filePath, (error, metadata) => {
          if (error) {
            reject(
              error instanceof Error
                ? error
                : new Error('Unable to read media duration'),
            );

            return;
          }

          const duration = metadata.format.duration;

          if (typeof duration === 'number') {
            resolve(duration);
            return;
          }

          if (duration) {
            resolve(Number(duration));
            return;
          }

          resolve(undefined);
        });
      });
    } catch {
      throw new InternalServerErrorException('Unable to read media duration');
    }
  }
}
