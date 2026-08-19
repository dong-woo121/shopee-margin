export type CountryCode = 'SG' | 'TW' | 'TH' | 'MY';
export type CalcMode = 'predict' | 'settle';
export type Brand = '인셀덤' | '애터미';

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
  brand: Brand;
  name: string;
  refPrice?: number;       // 인셀덤: 정가 (원가 = 정가 × 전체매입률%)
  purchasePrice?: number;  // 애터미: 당사공급가
  splitCount?: number;     // 분할수 기본 1
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
