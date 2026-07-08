import { useMemo } from 'react';
import type { CountryCode, CalcMode, Settings } from '../types';
import { COUNTRY_MAP } from '../constants';
import { useCalcInputs } from '../hooks/useCalcInputs';
import { calculate } from '../utils/calc';
import { krw } from '../utils/format';
import NumberInput from './NumberInput';
import ResultCard from './ResultCard';

interface Props {
  country: CountryCode;
  mode: CalcMode;
  settings: Settings;
}

const p = (s: string) => parseFloat(s.replace(/,/g, '')) || 0;

export default function Calculator({ country, mode, settings }: Props) {
  const config = COUNTRY_MAP[country];
  const exchangeRate = settings.exchangeRates[country];
  const { inputs, set } = useCalcInputs(country);

  const result = useMemo(() => {
    return calculate({
      salePrice:     p(inputs.salePrice),
      exchangeRate,
      refPrice:      p(inputs.refPrice),
      costRate:      p(inputs.costRate),
      vatRate:       p(inputs.vatRate),
      feeRate:       p(inputs.feeRate),
      settlementLocal: p(inputs.settlementLocal),
    });
  }, [inputs, exchangeRate]);

  const costPrice = p(inputs.refPrice) * (p(inputs.costRate) / 100);
  const vatRefund = costPrice * (p(inputs.vatRate) / 100);
  const totalCost = costPrice - vatRefund;

  const ready = p(inputs.salePrice) > 0 && p(inputs.refPrice) > 0 && p(inputs.costRate) > 0;
  const settleReady = ready && (mode === 'predict' || p(inputs.settlementLocal) > 0);

  return (
    <div className="flex flex-col gap-0">
      {/* 환율 표시 */}
      <div className="mx-4 my-3 flex items-center justify-between bg-orange-50 rounded-xl px-4 py-2.5">
        <span className="text-xs text-gray-500">환율</span>
        <span className="text-sm font-semibold text-gray-700">
          1 {config.currency} = <span className="text-orange-600">{exchangeRate.toLocaleString()}</span>원
        </span>
        <span className="text-xs text-gray-400">설정에서 변경</span>
      </div>

      {/* 입력 폼 */}
      <div className="mx-4 bg-white rounded-2xl border border-gray-200 px-4 py-2 mb-3">
        <NumberInput
          label={`판매가 (${config.symbol})`}
          value={inputs.salePrice}
          onChange={set('salePrice')}
          suffix={config.currency}
          hint={p(inputs.salePrice) > 0 ? `≈ ${krw(p(inputs.salePrice) * exchangeRate)}` : undefined}
        />
        <NumberInput
          label="정가 (원)"
          value={inputs.refPrice}
          onChange={set('refPrice')}
          suffix="원"
          placeholder="한국 정가"
        />
        <NumberInput
          label="매입률"
          value={inputs.costRate}
          onChange={set('costRate')}
          suffix="%"
          hint={costPrice > 0 ? krw(costPrice) : undefined}
        />
        <NumberInput
          label="부가세환급률"
          value={inputs.vatRate}
          onChange={set('vatRate')}
          suffix="%"
          hint={vatRefund > 0 ? `환급 -${krw(vatRefund)} → 실원가 ${krw(totalCost)}` : undefined}
        />

        {mode === 'predict' ? (
          <NumberInput
            label="총 수수료율"
            value={inputs.feeRate}
            onChange={set('feeRate')}
            suffix="%"
          />
        ) : (
          <NumberInput
            label={`정산금액 (${config.symbol})`}
            value={inputs.settlementLocal}
            onChange={set('settlementLocal')}
            suffix={config.currency}
            placeholder="쇼피 정산 금액"
            hint={p(inputs.settlementLocal) > 0 ? `≈ ${krw(p(inputs.settlementLocal) * exchangeRate)}` : undefined}
          />
        )}
      </div>

      <ResultCard mode={mode} result={result} ready={settleReady} />
    </div>
  );
}
