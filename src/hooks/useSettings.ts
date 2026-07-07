import { useState, useEffect } from 'react';
import type { Settings, CountryCode } from '../types';
import { DEFAULT_SETTINGS } from '../constants';

const KEY = 'shopee-settings';

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          exchangeRates: { ...DEFAULT_SETTINGS.exchangeRates, ...parsed.exchangeRates },
          feeRates:      { ...DEFAULT_SETTINGS.feeRates,      ...parsed.feeRates      },
          vatRate:       parsed.vatRate ?? DEFAULT_SETTINGS.vatRate,
        };
      }
    } catch {}
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(settings));
  }, [settings]);

  const setExchangeRate = (code: CountryCode, rate: number) =>
    setSettings(s => ({ ...s, exchangeRates: { ...s.exchangeRates, [code]: rate } }));

  const setFeeRate = (code: CountryCode, rate: number) =>
    setSettings(s => ({ ...s, feeRates: { ...s.feeRates, [code]: rate } }));

  const setVatRate = (rate: number) =>
    setSettings(s => ({ ...s, vatRate: rate }));

  const reset = () => setSettings(DEFAULT_SETTINGS);

  return { settings, setExchangeRate, setFeeRate, setVatRate, reset };
}
