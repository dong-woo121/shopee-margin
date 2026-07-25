import type { CountryCode, CountryConfig, Settings, Product } from './types';

export const COUNTRIES: CountryConfig[] = [
  { code: 'SG', name: '싱가폴',    flag: '🇸🇬', currency: 'SGD', symbol: 'S$',  defaultRate: 1010, defaultFeeRate: 12 },
  { code: 'TW', name: '대만',      flag: '🇹🇼', currency: 'TWD', symbol: 'NT$', defaultRate: 43,   defaultFeeRate: 12 },
  { code: 'TH', name: '태국',      flag: '🇹🇭', currency: 'THB', symbol: '฿',   defaultRate: 40,   defaultFeeRate: 12 },
  { code: 'MY', name: '말레이시아', flag: '🇲🇾', currency: 'MYR', symbol: 'RM',  defaultRate: 310,  defaultFeeRate: 12 },
];

export const COUNTRY_MAP: Record<CountryCode, CountryConfig> = Object.fromEntries(
  COUNTRIES.map(c => [c.code, c])
) as Record<CountryCode, CountryConfig>;

export const DEFAULT_SETTINGS: Settings = {
  exchangeRates: { SG: 1010, TW: 43, TH: 40, MY: 310 },
  feeRates:      { SG: 12,   TW: 12, TH: 12, MY: 12  },
  vatRate: 10,
  costRate: 70,
};

export const CURRENCY_API_MAP: Record<CountryCode, string> = {
  SG: 'SGD', TW: 'TWD', TH: 'THB', MY: 'MYR',
};

export const PRODUCTS: Product[] = [
  { id: 'balancing_cleanser',  name: '벨런싱 젤 클렌저',          refPrice: 27500  },
  { id: 'multi_stick',         name: '멀티스틱밤',                refPrice: 29000  },
  { id: 'sun_protector',       name: '모이스처 레이어 선 프로텍터', refPrice: 33000  },
  { id: 'bb_cream',            name: '쉬어 글로우 비비',           refPrice: 33000  },
  { id: 'makeup_spray',        name: '메이크업 스프레이',           refPrice: 36000  },
  { id: 'cleansing_oil',       name: '클렌징 오일',               refPrice: 39000  },
  { id: 'cleansing_powder',    name: '클렌징 파우더 워시',          refPrice: 39000  },
  { id: 'calming_gel',         name: '카밍 젤',                   refPrice: 44000  },
  { id: 'two_phase_mist',      name: '투페이스 오일 미스트',        refPrice: 46000  },
  { id: 'luminous_cushion',    name: '루미너스 쿠션',              refPrice: 68000  },
  { id: 'firming_mask',        name: '퍼밍 멜팅 마스크',           refPrice: 77000  },
  { id: 'derma_cream',         name: '더마톨로지크림',             refPrice: 79000  },
  { id: 'radiansome_toner',    name: '래디언솜 토너',              refPrice: 85000  },
  { id: 'radiansome_cream',    name: '래디언솜 크림',              refPrice: 110000 },
  { id: 'radiansome_essence',  name: '래디언솜 에센스',            refPrice: 130000 },
  { id: 'first_package',       name: '퍼스트 패키지',             refPrice: 119000 },
  { id: 'set_3',               name: '3종세트',                   refPrice: 198000 },
  { id: 'set_5',               name: '5종세트',                   refPrice: 288000 },
];

export const PRODUCT_MAP: Record<string, Product> = Object.fromEntries(
  PRODUCTS.map(p => [p.id, p])
);
