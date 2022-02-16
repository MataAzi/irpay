import Storages, { PayStatus, StorageData } from '../Storage';
import crypto from 'crypto';

const data: Array<StorageData> = [];

async function getPayById(id: string | number): Promise<StorageData | undefined> {
  return data.find((o) => o.id === id);
}

async function getPayByPayId(payId: string): Promise<StorageData | undefined> {
  return data.find((o) => o.payId === payId);
}

async function createNewPay(payId: string, additionalData: Array<object | string>): Promise<StorageData> {
  try {
    const payExist = await getPayByPayId(payId);
    if (payExist) throw new Error('Duplicate Pay Id');
    const temp = { id: crypto.randomUUID(), payId, additionalData, status: PayStatus.Waiting };
    data.push(temp);
    return temp;
  } catch (e) {
    throw new Error('An Error Occured' + e);
  }
}

async function changePayStatus(payId: string, status: PayStatus): Promise<StorageData | undefined> {
  const payData = data.find((o) => o.payId === payId);
  const payDataIndex = data.findIndex((o) => o.payId === payId);
  if (!payData) return undefined;
  delete data[payDataIndex];
  const temp = { ...payData, status };
  data.push(temp);
  return temp;
}

const MemoryStorage = new Storages(getPayById, getPayByPayId, createNewPay, changePayStatus);

export default MemoryStorage;
