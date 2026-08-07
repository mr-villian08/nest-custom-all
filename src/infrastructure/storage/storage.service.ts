import { Inject, Injectable } from '@nestjs/common';

import { StorageRegistry } from './storage.registry';

import { UploadOptions } from './interfaces/upload-options.interface';

import { UploadResult } from './interfaces/upload-result.interface';

import { STORAGE_OPTIONS } from './constants/storage.constants';
import type { StorageModuleOptions } from './interfaces/storage-module-options.interface';

@Injectable()
export class StorageService {
  constructor(
    private readonly registry: StorageRegistry,

    @Inject(STORAGE_OPTIONS)
    private readonly options: StorageModuleOptions,
  ) {}

  async upload(
    files: unknown[],
    options: UploadOptions,
  ): Promise<UploadResult> {
    const driver = options.driver ?? this.options.defaultDriver;

    const adapter = this.registry.get(driver);

    return adapter.upload(files, options);
  }

  async delete(path: string, driver = this.options.defaultDriver) {
    return this.registry.get(driver).delete(path);
  }

  async exists(path: string, driver = this.options.defaultDriver) {
    return this.registry.get(driver).exists(path);
  }

  async move(from: string, to: string, driver = this.options.defaultDriver) {
    return this.registry.get(driver).move(from, to);
  }

  async copy(from: string, to: string, driver = this.options.defaultDriver) {
    return this.registry.get(driver).copy(from, to);
  }

  url(path: string, driver = this.options.defaultDriver) {
    return this.registry.get(driver).url(path);
  }
}
