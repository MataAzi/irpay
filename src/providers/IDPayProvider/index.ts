import axios, { AxiosError, AxiosInstance } from 'axios';
import Provider, { PayCheckResult, PayCreationResult, PayVerificationResult } from '../Provider';
import { Container } from 'typedi';
import { randomUUID } from 'crypto';
import Storages, { PayStatus } from '../../storages/Storage';

const baseUrl = 'https://api.idpay.ir/v1.1';
// Name Should Be callBack
let callback: string;
let axiosInstance: AxiosInstance;

/**
 * Init IDPayProvider
 * @param api_key Provide Api Key To Authenticate With PayGetway
 */
export default function init(apiKey: string, sandbox: boolean, _callBack: string) {
  axiosInstance = axios.create({
    baseURL: baseUrl,
    headers: {
      'X-API-KEY': apiKey,
      'X-SANDBOX': sandbox ? 1 : 0,
    },
  });
  callback = _callBack;
  return new Provider({ sendPayRequest, checkPayStatus, verifyPay });
}

const sendPayRequest = async (amount: number): Promise<PayCreationResult> => {
  const storage: Storages = Container.get('storage');
  const orderId = randomUUID();
  try {
    const result = await axiosInstance.post('/payment', { orderId, amount, callback });
    await storage.createNewPay(result.data.id, [`order_id:${orderId}`]);
    return { amount, payId: result.data.id, redirect_url: result.data.link };
  } catch (e: any) {
    if (e.response) {
      const error_code = e.response.data.error_code;
      const error_message = e.response.data.error_message;
      throw new Error(`${error_code} - ${error_message}`);
    }
    throw new Error('Network Connection Error!');
  }
};

const checkPayStatus = async (payId: string): Promise<PayCheckResult> => {
  const storage: Storages = Container.get('storage');
  const pay = await storage.getPayByPayId(payId);
  if (!pay) throw new Error('Pay Not Found!');
  try {
    // Not Splited Order Id
    const orderIdN = pay.additionalData.find((val) => val.toString().includes('order_id'));
    if (typeof orderIdN === 'string') {
      const orderId = orderIdN.split(':')[1];
      const payment = await axiosInstance.post('/payment/inquiry', {
        id: pay.payId,
        orderId,
      });
      const status = PayStatusList.find((o) => o.code.toString() === payment.data.status.toString());
      if (status?.code === 10) return { status: PayStatus.Waiting, code: status!.code.toString() };
      else if (status?.code === 100 || status?.code === 101)
        return { status: PayStatus.Successful, code: status!.code.toString() };
      else return { status: PayStatus.Failed, code: status!.code.toString() };
    } else throw new Error('Internal Error Occured! Order Id Not Found!');
  } catch (e: any) {
    if (e.response) {
      const error_code = e.response.data.error_code;
      const error_message = e.response.data.error_message;
      throw new Error(`${error_code} - ${error_message}`);
    }
    throw new Error('Network Connection Error!');
  }
};

const verifyPay = async (payId: string): Promise<PayVerificationResult> => {
  const storage: Storages = Container.get('storage');

  const checkResult = await checkPayStatus(payId);
  if (checkResult.status !== PayStatus.Waiting) {
    return {
      payId,
      status: checkResult.status,
      message: PayStatusList.find((o) => o.code.toString() === checkResult.code)?.decsription,
    };
  }

  const pay = await storage.getPayByPayId(payId);
  if (!pay) throw new Error('Pay Not Found!');
  if (pay.status !== PayStatus.Waiting) throw new Error('Pay Already Verified');

  try {
    const orderIdN = pay.additionalData.find((val) => val.toString().includes('order_id'));
    if (typeof orderIdN === 'string') {
      const orderId = orderIdN.split(':')[1];
      const result = await axiosInstance.post('/payment/verify', {
        id: pay.payId,
        orderId,
      });
      if (result.data.status.toString() === '100') {
        storage.changePayStatus(payId, PayStatus.Successful);
        return { payId, status: PayStatus.Successful };
      } else {
        storage.changePayStatus(payId, PayStatus.Failed);
        return {
          payId,
          status: PayStatus.Failed,
          message: PayStatusList.find((o) => o.code.toString() === result.data.status.toString())?.decsription,
        };
      }
    } else throw new Error('Internal Error Occured! Order Id Not Found!');
  } catch (e: any) {
    if (e.response) {
      const error_code = e.response.data.error_code;
      const error_message = e.response.data.error_message;
      throw new Error(`${error_code} - ${error_message}`);
    }
    throw new Error('Network Connection Error!');
  }
};

const PayStatusList = [
  {
    code: 1,
    decsription: 'پرداخت انجام نشده است',
  },
  {
    code: 2,
    decsription: 'پرداخت ناموفق بوده است',
  },
  {
    code: 3,
    decsription: 'خطا رخ داده است',
  },
  {
    code: 4,
    decsription: 'بلوکه شده',
  },
  {
    code: 5,
    decsription: 'برگشت به پرداخت کننده',
  },
  {
    code: 6,
    decsription: 'برگشت خورده سیستمی',
  },
  {
    code: 7,
    decsription: 'انصراف از پرداخت',
  },
  {
    code: 8,
    decsription: 'به درگاه پرداخت منتقل شد',
  },
  {
    code: 10,
    decsription: 'در انتظار تایید پرداخت',
  },
  {
    code: 100,
    decsription: 'پرداخت تایید شده است',
  },
  {
    code: 101,
    decsription: 'پرداخت قبلا تایید شده است',
  },
  {
    code: 200,
    decsription: 'به دریافت کننده واریز شد',
  },
];
