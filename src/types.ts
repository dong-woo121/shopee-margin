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

export interface Settings {
  exchangeRates: Record<CountryCode, number>;
  feeRates: Record<CountryCode, number>;
  vatRate: number;
}

export interface CalcInputs {
  salePrice: string;
  refPrice: string;
  costRate: string;
  vatRate: string;
  feeRate: string;
  settlementLocal: string;
}

export interface CalcResult {
  salePriceKRW: number;
  costPrice: number;
  vatRefund: number;
  totalCost: number;
  feeAmount: number;
  predictedSettlement: number;
  predictedMargin: number;
  predictedMarginRate: number;
  actualSettlementKRW: number;
  actualMargin: number;
  actualMarginRate: number;
}
