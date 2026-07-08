import { useState, useEffect } from 'react';
import type { CountryCode, CalcInputs } from '../types';

const DEFAULT_INPUTS: CalcInputs = {
  salePrice: '',
  refPrice: '',
  costRate: '70',
  vatRate: '10',
  feeRate: '12',
  settlementLocal: '',
};

export function useCalcInputs(country: CountryCode) {
  const key = `shopee-calc-${country}`;

  const [inputs, setInputs] = useState<CalcInputs>(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) return { ...DEFAULT_INPUTS, ...JSON.parse(raw) };
    } catch {}
    return DEFAULT_INPUTS;
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setInputs({ ...DEFAULT_INPUTS, ...JSON.parse(raw) });
      else setInputs(DEFAULT_INPUTS);
    } catch {
      setInputs(DEFAULT_INPUTS);
    }
  }, [country, key]);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(inputs));
  }, [inputs, key]);

  const set = (field: keyof CalcInputs) => (value: string) =>
    setInputs(prev => ({ ...prev, [field]: value }));

  return { inputs, set };
}
