import Provider from '../providers/Provider';
import Storages from '../storages/Storage';
import { Container, Service } from 'typedi';

export default class NodePay {
  private Storage: Storages;
  public Provider: Provider;

  constructor(storage: Storages, provider: Provider) {
    this.Storage = storage;
    Container.set('storage', storage);
    this.Provider = provider;
  }
}
