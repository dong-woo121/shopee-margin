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

export const INSELDUMB_PRODUCTS: Product[] = [
  { id: 'is_balancing_cleanser', brand: '인셀덤', name: '벨런싱 젤 클렌저',          refPrice: 27500  },
  { id: 'is_multi_stick',        brand: '인셀덤', name: '멀티스틱밤',                refPrice: 29000  },
  { id: 'is_sun_protector',      brand: '인셀덤', name: '모이스처 레이어 선 프로텍터', refPrice: 33000  },
  { id: 'is_bb_cream',           brand: '인셀덤', name: '쉬어 글로우 비비',           refPrice: 33000  },
  { id: 'is_makeup_spray',       brand: '인셀덤', name: '메이크업 스프레이',           refPrice: 36000  },
  { id: 'is_cleansing_oil',      brand: '인셀덤', name: '클렌징 오일',               refPrice: 39000  },
  { id: 'is_cleansing_powder',   brand: '인셀덤', name: '클렌징 파우더 워시',          refPrice: 39000  },
  { id: 'is_calming_gel',        brand: '인셀덤', name: '카밍 젤',                   refPrice: 44000  },
  { id: 'is_two_phase_mist',     brand: '인셀덤', name: '투페이스 오일 미스트',        refPrice: 46000  },
  { id: 'is_luminous_cushion',   brand: '인셀덤', name: '루미너스 쿠션',              refPrice: 68000  },
  { id: 'is_firming_mask',       brand: '인셀덤', name: '퍼밍 멜팅 마스크',           refPrice: 77000  },
  { id: 'is_derma_cream',        brand: '인셀덤', name: '더마톨로지크림',             refPrice: 79000  },
  { id: 'is_radiansome_toner',   brand: '인셀덤', name: '래디언솜 토너',              refPrice: 85000  },
  { id: 'is_radiansome_cream',   brand: '인셀덤', name: '래디언솜 크림',              refPrice: 110000 },
  { id: 'is_radiansome_essence', brand: '인셀덤', name: '래디언솜 에센스',            refPrice: 130000 },
  { id: 'is_first_package',      brand: '인셀덤', name: '퍼스트 패키지',             refPrice: 119000 },
  { id: 'is_set_3',              brand: '인셀덤', name: '3종세트',                   refPrice: 198000 },
  { id: 'is_set_5',              brand: '인셀덤', name: '5종세트',                   refPrice: 288000 },
];

export const ATOMY_PRODUCTS: Product[] = [
  { id: 'at_alaska_omega3',    brand: '애터미', name: '알레스카오메가3',           purchasePrice: 14900, splitCount: 1 },
  { id: 'at_lactic_acid',      brand: '애터미', name: '유산균',                    purchasePrice: 35000, splitCount: 1 },
  { id: 'at_aqua_cream',       brand: '애터미', name: '아쿠아수분크림',             purchasePrice: 9800,  splitCount: 1 },
  { id: 'at_toothpaste_4set',  brand: '애터미', name: '치약',                     purchasePrice: 53200, splitCount: 4 },
  { id: 'at_toothpaste_50g',   brand: '애터미', name: '치약 50g',                 purchasePrice: 3700,  splitCount: 1 },
  { id: 'at_eanm_toothpaste',  brand: '애터미', name: '이앤몸치약',                purchasePrice: 7300,  splitCount: 1 },
  { id: 'at_scalp_shampoo',    brand: '애터미', name: '스칼프샴푸',                purchasePrice: 8000,  splitCount: 1 },
  { id: 'at_scalp_cond',       brand: '애터미', name: '스칼프컨디셔너',            purchasePrice: 8000,  splitCount: 1 },
  { id: 'at_kids_toothbrush',  brand: '애터미', name: '어린이칫솔',                purchasePrice: 6500,  splitCount: 1 },
  { id: 'at_compact_brush',    brand: '애터미', name: '콤팩트칫솔 1SET',           purchasePrice: 6500,  splitCount: 1 },
  { id: 'at_toothbrush_1set',  brand: '애터미', name: '칫솔 1SET(8개)',            purchasePrice: 5200,  splitCount: 1 },
  { id: 'at_fame_toner',       brand: '애터미', name: '더페임 토너',               purchasePrice: 16000, splitCount: 1 },
  { id: 'at_fame_lotion',      brand: '애터미', name: '더페임 로션',               purchasePrice: 15000, splitCount: 1 },
  { id: 'at_fame_barrier',     brand: '애터미', name: '더페임 베리어크림',          purchasePrice: 16000, splitCount: 1 },
  { id: 'at_fame_essence',     brand: '애터미', name: '더페임 에센스',             purchasePrice: 12500, splitCount: 1 },
  { id: 'at_fame_serum',       brand: '애터미', name: '더페임 페이스앤아이세럼',   purchasePrice: 18000, splitCount: 1 },
  { id: 'at_healthy_glow',     brand: '애터미', name: '헬시글로우',                purchasePrice: 8500,  splitCount: 1 },
  { id: 'at_herb_shampoo',     brand: '애터미', name: '한방샴푸',                  purchasePrice: 26100, splitCount: 4 },
  { id: 'at_herb_cond',        brand: '애터미', name: '한방컨디셔너',              purchasePrice: 26100, splitCount: 4 },
  { id: 'at_suncream_beige',   brand: '애터미', name: '선크림 베이지',             purchasePrice: 21000, splitCount: 4 },
  { id: 'at_bb_cream',         brand: '애터미', name: '비비크림',                  purchasePrice: 21000, splitCount: 4 },
  { id: 'at_foam_cleanser',    brand: '애터미', name: '폼클렌저',                  purchasePrice: 22500, splitCount: 4 },
  { id: 'at_deep_cleanser',    brand: '애터미', name: '딥클렌저',                  purchasePrice: 22500, splitCount: 4 },
  { id: 'at_peel_off_mask',    brand: '애터미', name: '필오프마스크',              purchasePrice: 22000, splitCount: 4 },
  { id: 'at_peeling_gel',      brand: '애터미', name: '필링젤',                    purchasePrice: 22500, splitCount: 4 },
  { id: 'at_oil_serum_mist',   brand: '애터미', name: '앱솔루트 오일세럼미스트',   purchasePrice: 11000, splitCount: 1 },
  { id: 'at_deep_cleanse_oil', brand: '애터미', name: '딥퓨어 클렌징오일',         purchasePrice: 15000, splitCount: 1 },
  { id: 'at_absolute_toner',   brand: '애터미', name: '앱솔루트 토너',             purchasePrice: 23000, splitCount: 1 },
];

export const DEFAULT_PRODUCTS: Product[] = [...INSELDUMB_PRODUCTS, ...ATOMY_PRODUCTS];
