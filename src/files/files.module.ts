import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';

import { FilesController } from './files.controller';

import { FilesService } from './files.service';

import { LocalStorageService } from './storage/local-storage.service';

import { FileValidationService } from './validation/file-validation.service';

import { MediaService } from './media/media.service';

import { STORAGE_PROVIDER } from './constants/file.token';

@Module({
  imports: [ConfigModule],

  controllers: [FilesController],

  providers: [
    FilesService,

    FileValidationService,

    MediaService,

    LocalStorageService,

    {
      provide: STORAGE_PROVIDER,

      useExisting: LocalStorageService,
    },
  ],

  exports: [FilesService],
})
export class FilesModule {}
