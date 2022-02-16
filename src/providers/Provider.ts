import { AxiosInstance } from 'axios';
import Storages, { PayStatus } from '../storages/Storage';

interface IProvider {
  sendPayRequest: (amount: number) => Promise<PayCreationResult>;
  checkPayStatus: (payId: string) => Promise<PayCheckResult>;
  verifyPay: (payId: string) => Promise<PayVerificationResult>;
}

export default class Provider {
  sendPayRequest: (amount: number) => Promise<PayCreationResult>;
  checkPayStatus: (payId: string) => Promise<PayCheckResult>;
  verifyPay: (payId: string) => Promise<PayVerificationResult>;

  constructor(provider: IProvider) {
    this.sendPayRequest = provider.sendPayRequest;
    this.checkPayStatus = provider.checkPayStatus;
    this.verifyPay = provider.verifyPay;
  }
}

export interface PayCheckResult {
  status: PayStatus;
  code: string;
}

export interface PayCreationResult {
  redirect_url: string;
  payId: string;
  amount: number;
}

export interface PayVerificationResult {
  status: PayStatus;
  amount?: number;
  payId: number | string;
  message?: string;
}
