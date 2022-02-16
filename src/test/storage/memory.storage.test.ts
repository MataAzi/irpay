import MemoryStorage from '../../storages/Memory';
import { StorageData } from '../../storages/Storage';

test('Test Storage Creates Successfull', async () => {
  const data = await MemoryStorage.createNewPay('test 1', []);
  expect(data.id).toBeTruthy();
});

describe('Find Data By Id & Duplicate Errors', () => {
  let id: number | string;
  beforeAll(async () => {
    const created = await MemoryStorage.createNewPay('test 2', []);
    id = created.id;
  });
  test('Find Created Record By Id', async () => {
    const pay = await MemoryStorage.getPayById(id);
    return expect(pay).toBeTruthy();
  });

  test('Find Created Record By PayId', async () => {
    const pay = await MemoryStorage.getPayByPayId('test 2');
    return expect(pay).toBeTruthy();
  });

  test('Duplicate PayId Record Error', async () => {
    return expect(MemoryStorage.createNewPay('test 2', [])).rejects.toThrow('Duplicate Pay Id');
  });
});
