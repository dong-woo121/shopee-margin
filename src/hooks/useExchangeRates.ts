import { useState, useCallback } from 'react';
import type { CountryCode } from '../types';
import { CURRENCY_API_MAP } from '../constants';

export function useExchangeRates() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRates = useCallback(async (): Promise<Partial<Record<CountryCode, number>> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      if (!res.ok) throw new Error('network');
      const data = await res.json();
      if (data.result !== 'success') throw new Error('api');

      const usdToKrw: number = data.rates['KRW'];
      const result: Partial<Record<CountryCode, number>> = {};

      for (const [code, currency] of Object.entries(CURRENCY_API_MAP)) {
        const usdToLocal: number = data.rates[currency];
        if (usdToLocal) result[code as CountryCode] = Math.round(usdToKrw / usdToLocal);
      }
      return result;
    } catch {
      setError('환율 조회 실패. 직접 수정해주세요.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, fetchRates };
}
