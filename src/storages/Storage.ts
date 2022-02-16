export default class Storages {
  getPayById: (id: string | number) => Promise<StorageData | undefined>;
  getPayByPayId: (payId: string) => Promise<StorageData | undefined>;
  createNewPay: (payId: string, additionalData: Array<object | string>) => Promise<StorageData>;
  changePayStatus: (payId: string, status: PayStatus) => Promise<StorageData | undefined>;

  constructor(
    _getPayById: (id: string | number) => Promise<StorageData | undefined>,
    _getPayByPayId: (payId: string) => Promise<StorageData | undefined>,
    _createNewPay: (payId: string, additionalData: Array<object | string>) => Promise<StorageData>,
    _changePayStatus: (payId: string, status: PayStatus) => Promise<StorageData | undefined>,
  ) {
    this.getPayByPayId = _getPayByPayId;
    this.getPayById = _getPayById;
    this.createNewPay = _createNewPay;
    this.changePayStatus = _changePayStatus;
  }
}

export interface StorageData {
  id: string | number;
  payId: string;
  status: PayStatus;
  additionalData: Array<object | string>;
}

export enum PayStatus {
  Waiting,
  Successful,
  Failed,
}
