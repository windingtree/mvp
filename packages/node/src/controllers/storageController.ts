import { levelStorage } from '@windingtree/sdk-storage';
import { LevelDBStorage } from '@windingtree/sdk-storage/level';
import { Storages } from '../types.js';

class StorageController {
  private queueStorage: undefined | LevelDBStorage;
  private commonConfigStorage: undefined | LevelDBStorage;
  private usersStorage: undefined | LevelDBStorage;
  private dealsStorage: undefined | LevelDBStorage;
  private airplanesStorage: undefined | LevelDBStorage;
  private offersStorage: undefined | LevelDBStorage;

  init = async (): Promise<void> => {
    this.queueStorage = await levelStorage.createInitializer({
      path: './queue.db',
      scope: 'queue',
    })();
    this.commonConfigStorage = await levelStorage.createInitializer({
      path: './common.db',
      scope: 'common',
    })();
    this.usersStorage = await levelStorage.createInitializer({
      path: './users.db',
      scope: 'users',
    })();
    this.dealsStorage = await levelStorage.createInitializer({
      path: './deals.db',
      scope: 'deals',
    })();
    this.airplanesStorage = await levelStorage.createInitializer({
      path: './airplanes.db',
      scope: 'airplanes',
    })();
    this.offersStorage = await levelStorage.createInitializer({
      path: './offer.db',
      scope: 'offer',
    })();

    await this.openAll();
  };

  getStorages = (): Storages => {
    if (
      !this.queueStorage ||
      !this.commonConfigStorage ||
      !this.usersStorage ||
      !this.dealsStorage ||
      !this.airplanesStorage ||
      !this.offersStorage
    ) {
      throw new Error('Storages not initialized');
    }

    return {
      queueStorage: this.queueStorage,
      commonConfigStorage: this.commonConfigStorage,
      usersStorage: this.usersStorage,
      dealsStorage: this.dealsStorage,
      airplanesStorage: this.airplanesStorage,
      offersStorage: this.offersStorage,
    };
  };

  openAll = async () => {
    await this.queueStorage?.instance.open();
    await this.commonConfigStorage?.instance.open();
    await this.usersStorage?.instance.open();
    await this.dealsStorage?.instance.open();
    await this.airplanesStorage?.instance.open();
    await this.offersStorage?.instance.open();
  };

  stopAll = async () => {
    await this.queueStorage?.instance.close();
    await this.commonConfigStorage?.instance.close();
    await this.usersStorage?.instance.close();
    await this.dealsStorage?.instance.close();
    await this.airplanesStorage?.instance.close();
    await this.offersStorage?.instance.close();
  };
}

export const storageController: StorageController = new StorageController();
