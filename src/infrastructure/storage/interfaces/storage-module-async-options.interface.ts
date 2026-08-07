import { InjectionToken, ModuleMetadata, Type } from '@nestjs/common';
import { StorageModuleOptions } from './storage-module-options.interface';

export interface StorageOptionsFactory {
  createStorageOptions(): StorageModuleOptions | Promise<StorageModuleOptions>;
}

export interface StorageModuleAsyncOptions extends Pick<
  ModuleMetadata,
  'imports'
> {
  useExisting?: Type<StorageOptionsFactory>;

  useClass?: Type<StorageOptionsFactory>;

  useFactory?: (
    ...args: unknown[]
  ) => Promise<StorageModuleOptions> | StorageModuleOptions;

  inject?: InjectionToken[];
}
