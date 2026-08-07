import { StorageDriver } from '../enums/storage-driver.enum';

export interface StorageModuleOptions {
  defaultDriver: StorageDriver;

  /**
   * Root storage path.
   * Example: storage
   */
  root: string;

  /**
   * Public URL.
   * Example:
   * http://localhost:3000/storage
   */
  publicUrl: string;
}
