export type CountryCode = 'SG' | 'TW' | 'TH' | 'MY';
export type CalcMode = 'predict' | 'settle';

export interface CountryConfig {
  code: CountryCode;
  name: string;
  flag: string;
  currency: string;
  symbol: string;
  defaultRate: number;
  defaultFeeRate: number;
}

export interface Product {
  id: string;
  name: string;
  refPrice: number;
}

export interface OrderItem {
  productId: string;
  salePrice: string;
  qty: number;
}

export interface Settings {
  exchangeRates: Record<CountryCode, number>;
  feeRates: Record<CountryCode, number>;
  vatRate: number;
  costRate: number;
}
