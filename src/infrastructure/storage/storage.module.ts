import { DynamicModule, Global, Module, Provider } from '@nestjs/common';

import { StorageRegistry } from './storage.registry';
import { StorageService } from './storage.service';

import { STORAGE_OPTIONS } from './constants/storage.constants';

import {
  StorageModuleAsyncOptions,
  StorageOptionsFactory,
} from './interfaces/storage-module-async-options.interface';

import { StorageModuleOptions } from './interfaces/storage-module-options.interface';

@Global()
@Module({})
export class StorageModule {
  static forRoot(options: StorageModuleOptions): DynamicModule {
    return {
      module: StorageModule,

      providers: [
        StorageRegistry,

        StorageService,

        {
          provide: STORAGE_OPTIONS,
          useValue: options,
        },
      ],

      exports: [StorageRegistry, StorageService],
    };
  }

  static forRootAsync(options: StorageModuleAsyncOptions): DynamicModule {
    return {
      module: StorageModule,

      imports: options.imports,

      providers: [
        StorageRegistry,

        StorageService,

        this.createAsyncProviders(options),
      ],

      exports: [StorageRegistry, StorageService],
    };
  }

  private static createAsyncProviders(
    options: StorageModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: STORAGE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject ?? [],
      };
    }

    return {
      provide: STORAGE_OPTIONS,
      useFactory: async (factory: StorageOptionsFactory) =>
        factory.createStorageOptions(),
      inject: [options.useExisting ?? options.useClass!],
    };
  }
}
