import type { CalcMode, CalcResult } from '../types';
import { krw, pct } from '../utils/format';

interface Props {
  mode: CalcMode;
  result: CalcResult;
  ready: boolean;
}

function Row({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="flex justify-between items-baseline py-1.5">
      <span className="text-sm text-gray-600">{label}</span>
      <div className="text-right">
        <span className="text-sm font-medium text-gray-800">{value}</span>
        {sub && <span className="text-xs text-gray-400 ml-1">{sub}</span>}
      </div>
    </div>
  );
}

export default function ResultCard({ mode, result, ready }: Props) {
  if (!ready) {
    return (
      <div className="mx-4 mb-4 rounded-2xl bg-gray-50 border border-dashed border-gray-200 p-6 text-center">
        <p className="text-sm text-gray-400">판매가와 원가 정보를 입력하면<br />마진이 계산됩니다</p>
      </div>
    );
  }

  const margin = mode === 'predict' ? result.predictedMargin : result.actualMargin;
  const marginRate = mode === 'predict' ? result.predictedMarginRate : result.actualMarginRate;
  const settlement = mode === 'predict' ? result.predictedSettlement : null;
  const isPositive = margin >= 0;

  return (
    <div className="mx-4 mb-4 rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-4 pt-4 pb-2 border-b border-gray-100">
        <Row label="판매금액 (KRW)" value={krw(result.salePriceKRW)} />
        <Row label="매입원가" value={krw(result.costPrice)} />
        <Row label="└ 부가세" value={krw(result.vatAmount)} />
        <Row label="총원가" value={krw(result.totalCost)} />
        {mode === 'predict' && (
          <Row label="수수료" value={krw(result.feeAmount)} />
        )}
        {settlement !== null && (
          <Row label="예상 정산금액" value={krw(settlement)} />
        )}
      </div>

      <div className={`px-4 py-4 ${isPositive ? 'bg-green-50' : 'bg-red-50'}`}>
        <div className="flex justify-between items-center">
          <span className="text-base font-semibold text-gray-700">
            {mode === 'predict' ? '예상 마진' : '실제 마진'}
          </span>
          <div className="text-right">
            <span className={`text-xl font-bold ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
              {krw(margin)}
            </span>
          </div>
        </div>
        <div className="flex justify-end mt-1">
          <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${
            isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
          }`}>
            마진율 {pct(marginRate)}
          </span>
        </div>
      </div>
    </div>
  );
}
