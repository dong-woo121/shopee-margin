import type { CountryCode, CountryConfig, Settings } from './types';

export const COUNTRIES: CountryConfig[] = [
  { code: 'SG', name: '싱가폴', flag: '🇸🇬', currency: 'SGD', symbol: 'S$', defaultRate: 1010, defaultFeeRate: 12 },
  { code: 'TW', name: '대만',   flag: '🇹🇼', currency: 'TWD', symbol: 'NT$', defaultRate: 43,   defaultFeeRate: 12 },
  { code: 'TH', name: '태국',   flag: '🇹🇭', currency: 'THB', symbol: '฿',   defaultRate: 40,   defaultFeeRate: 12 },
  { code: 'MY', name: '말레이시아', flag: '🇲🇾', currency: 'MYR', symbol: 'RM', defaultRate: 310, defaultFeeRate: 12 },
];

export const COUNTRY_MAP: Record<CountryCode, CountryConfig> = Object.fromEntries(
  COUNTRIES.map(c => [c.code, c])
) as Record<CountryCode, CountryConfig>;

export const DEFAULT_SETTINGS: Settings = {
  exchangeRates: { SG: 1010, TW: 43, TH: 40, MY: 310 },
  feeRates:      { SG: 12,   TW: 12, TH: 12, MY: 12  },
  vatRate: 10,
};

export const CURRENCY_API_MAP: Record<CountryCode, string> = {
  SG: 'SGD', TW: 'TWD', TH: 'THB', MY: 'MYR',
};
