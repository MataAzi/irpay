import { IdPayProvider, MemoryStorage } from "../..";
import IRPay from '../..'
const pay = new IRPay(MemoryStorage, IdPayProvider('6a7f99eb-7c20-4412-a972-6dfb7cd253a4', true, 'http://localhost:3000'))

test('Pay Creation Request', async () => {
    const payRequest = await pay.Provider.sendPayRequest(5000);
    return expect(payRequest).toHaveProperty('redirect_url');
})

// Rest Soon :)