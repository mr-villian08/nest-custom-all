import { Injectable } from '@nestjs/common';

import { StorageDriver } from './enums/storage-driver.enum';
import { StorageAdapter } from './adapters/storage.adapter';

@Injectable()
export class StorageRegistry {
  private readonly adapters = new Map<StorageDriver, StorageAdapter>();

  register(driver: StorageDriver, adapter: StorageAdapter): void {
    this.adapters.set(driver, adapter);
  }

  get(driver: StorageDriver): StorageAdapter {
    const adapter = this.adapters.get(driver);

    if (!adapter) {
      throw new Error(`Storage driver "${driver}" is not registered.`);
    }

    return adapter;
  }

  has(driver: StorageDriver): boolean {
    return this.adapters.has(driver);
  }

  registeredDrivers(): StorageDriver[] {
    return [...this.adapters.keys()];
  }
}
