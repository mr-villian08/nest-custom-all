import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';

import { FilesService } from './files.service';

import { LocalStorageService } from './storage/local-storage.service';

import { FileValidationService } from './validation/file-validation.service';

import { MediaService } from './media/media.service';

import fileConfig from '../../config/file.config';

import { STORAGE_PROVIDER } from '../constants/file.token';

import { FilesController } from './files.controller';

@Module({
  controllers: [FilesController],
  imports: [ConfigModule.forFeature(fileConfig)],

  providers: [
    FilesService,

    LocalStorageService,

    FileValidationService,

    MediaService,

    {
      provide: STORAGE_PROVIDER,

      useExisting: LocalStorageService,
    },
  ],

  exports: [FilesService],
})
export class FilesModule {}
