import { useState } from 'react';
import { COUNTRIES } from '../constants';
import type { CountryCode, Settings } from '../types';
import { useExchangeRates } from '../hooks/useExchangeRates';

interface Props {
  settings: Settings;
  onClose: () => void;
  onSetExchangeRate: (code: CountryCode, rate: number) => void;
  onSetFeeRate: (code: CountryCode, rate: number) => void;
  onSetVatRate: (rate: number) => void;
  onSetCostRate: (rate: number) => void;
  onReset: () => void;
  onManageProducts: () => void;
}

const inputCls = 'flex-1 text-right text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1.5 focus:outline-none focus:border-orange-400 text-gray-800 dark:text-gray-200';

export default function SettingsModal({
  settings, onClose, onSetExchangeRate, onSetFeeRate, onSetVatRate, onSetCostRate, onReset, onManageProducts,
}: Props) {
  const { loading, error, fetchRates } = useExchangeRates();
  const [localRates, setLocalRates] = useState<Record<CountryCode, string>>(
    Object.fromEntries(COUNTRIES.map(c => [c.code, String(settings.exchangeRates[c.code])])) as Record<CountryCode, string>
  );
  const [localFees, setLocalFees] = useState<Record<CountryCode, string>>(
    Object.fromEntries(COUNTRIES.map(c => [c.code, String(settings.feeRates[c.code])])) as Record<CountryCode, string>
  );
  const [localVat, setLocalVat] = useState(String(settings.vatRate));
  const [localCost, setLocalCost] = useState(String(settings.costRate));

  const handleSave = () => {
    COUNTRIES.forEach(c => {
      const r = parseFloat(localRates[c.code]);
      const f = parseFloat(localFees[c.code]);
      if (!isNaN(r) && r > 0) onSetExchangeRate(c.code, r);
      if (!isNaN(f) && f >= 0) onSetFeeRate(c.code, f);
    });
    const v = parseFloat(localVat);
    if (!isNaN(v) && v >= 0) onSetVatRate(v);
    const cost = parseFloat(localCost);
    if (!isNaN(cost) && cost > 0) onSetCostRate(cost);
    onClose();
  };

  const handleFetchRates = async () => {
    const rates = await fetchRates();
    if (rates) {
      setLocalRates(prev => ({
        ...prev,
        ...Object.fromEntries(Object.entries(rates).map(([k, v]) => [k, String(v)])),
      }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col" onClick={onClose}>
      <div className="flex-1 bg-black/50" />
      <div
        className="bg-white dark:bg-gray-900 rounded-t-2xl max-h-[80vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-800 dark:text-gray-200">기본 설정</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none">✕</button>
        </div>

        <div className="px-4 pb-6 space-y-5 pt-4">
          {/* 매입률 */}
          <section>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">매입률 (%)</h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">전 제품 동일 적용</p>
            <div className="flex items-center gap-2">
              <input type="text" inputMode="decimal" value={localCost} onChange={e => setLocalCost(e.target.value)} className={inputCls} />
              <span className="text-xs text-gray-400 dark:text-gray-500">%</span>
            </div>
          </section>

          {/* 환율 */}
          <section>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">환율 (1 외화 = ? 원)</h3>
              <button
                onClick={handleFetchRates}
                disabled={loading}
                className="text-xs text-orange-500 border border-orange-300 dark:border-orange-700 rounded-lg px-2 py-1 hover:bg-orange-50 dark:hover:bg-orange-900/20 disabled:opacity-50"
              >
                {loading ? '조회 중…' : '🔄 실시간 조회'}
              </button>
            </div>
            {error && <p className="text-xs text-red-500 mb-2">{error}</p>}
            {COUNTRIES.map(c => (
              <div key={c.code} className="flex items-center gap-2 py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                <span className="text-sm w-20 shrink-0 text-gray-700 dark:text-gray-300">{c.flag} {c.currency}</span>
                <input type="text" inputMode="decimal" value={localRates[c.code]} onChange={e => setLocalRates(p => ({ ...p, [c.code]: e.target.value }))} className={inputCls} />
                <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">원</span>
              </div>
            ))}
          </section>

          {/* 수수료 */}
          <section>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">국가별 총 수수료율 (%)</h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">플랫폼 수수료 + 결제 수수료 합산</p>
            {COUNTRIES.map(c => (
              <div key={c.code} className="flex items-center gap-2 py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                <span className="text-sm w-20 shrink-0 text-gray-700 dark:text-gray-300">{c.flag} {c.name}</span>
                <input type="text" inputMode="decimal" value={localFees[c.code]} onChange={e => setLocalFees(p => ({ ...p, [c.code]: e.target.value }))} className={inputCls} />
                <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">%</span>
              </div>
            ))}
          </section>

          {/* 부가세 환급률 */}
          <section>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">부가세 환급률 (%)</h3>
            <div className="flex items-center gap-2">
              <input type="text" inputMode="decimal" value={localVat} onChange={e => setLocalVat(e.target.value)} className={inputCls} />
              <span className="text-xs text-gray-400 dark:text-gray-500">%</span>
            </div>
          </section>

          <div className="flex gap-2 pt-2">
            <button onClick={onReset} className="flex-1 py-2.5 text-sm text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800">
              기본값 초기화
            </button>
            <button onClick={handleSave} className="flex-1 py-2.5 text-sm font-semibold text-white bg-orange-500 rounded-xl hover:bg-orange-600">
              저장
            </button>
          </div>

          {/* 제품 관리 링크 */}
          <button
            onClick={() => { onClose(); onManageProducts(); }}
            className="w-full py-2.5 text-sm text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-center gap-1"
          >
            📦 제품 관리 (추가·편집·삭제)
          </button>
        </div>
      </div>
    </div>
  );
}
