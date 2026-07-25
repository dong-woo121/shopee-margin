import { useMemo, useState } from 'react';
import type { CountryCode, CalcMode, Settings } from '../types';
import { COUNTRY_MAP, PRODUCTS, PRODUCT_MAP } from '../constants';
import { useOrderItems } from '../hooks/useOrderItems';
import { calculateOrder } from '../utils/calcOrder';
import { krw, pct } from '../utils/format';
import OrderList from './OrderList';

interface Props {
  country: CountryCode;
  mode: CalcMode;
  settings: Settings;
}

const p = (s: string) => parseFloat(s.replace(/,/g, '')) || 0;

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between items-baseline py-1.5">
      <span className="text-sm text-gray-600">{label}</span>
      <span className={`text-sm font-medium ${accent ? 'text-orange-600' : 'text-gray-800'}`}>{value}</span>
    </div>
  );
}

export default function OrderCalculator({ country, mode, settings }: Props) {
  const config = COUNTRY_MAP[country];
  const exchangeRate = settings.exchangeRates[country];
  const feeRate = settings.feeRates[country];
  const { items, settlementLocal, addItem, removeItem, updateQty, updateSalePrice, setSettlementLocal, clearOrder } = useOrderItems(country);
  const [showSheet, setShowSheet] = useState(false);

  // 현재 수량 맵 (bottom sheet 배지용)
  const qtyMap = useMemo(() => {
    const map: Record<string, number> = {};
    items.forEach(item => { map[item.productId] = item.qty; });
    return map;
  }, [items]);

  const result = useMemo(() => {
    const calcItems = items.map(item => ({
      product: PRODUCT_MAP[item.productId],
      salePrice: p(item.salePrice),
      qty: item.qty,
    }));
    return calculateOrder({
      items: calcItems,
      exchangeRate,
      costRate: settings.costRate,
      vatRate: settings.vatRate,
      feeRate,
      settlementLocal: p(settlementLocal),
    });
  }, [items, settlementLocal, exchangeRate, feeRate, settings.costRate, settings.vatRate]);

  const hasFilledItems = items.some(item => p(item.salePrice) > 0);
  const showResult = hasFilledItems && (mode === 'predict' || p(settlementLocal) > 0);
  const margin = mode === 'predict' ? result.predictedMargin : result.actualMargin;
  const marginRate = mode === 'predict' ? result.predictedMarginRate : result.actualMarginRate;
  const isPositive = margin >= 0;
  const totalQty = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <>
      <div className="flex flex-col gap-0">
        {/* 환율 / 매입률 + 제품추가 버튼 */}
        <div className="mx-4 my-3 flex items-center gap-2">
          <div className="flex-1 flex items-center justify-between bg-orange-50 rounded-xl px-3 py-2">
            <span className="text-xs text-gray-500">1 {config.currency}</span>
            <span className="text-sm font-semibold text-orange-600">{exchangeRate.toLocaleString()}원</span>
            <span className="text-xs text-gray-400">매입 {settings.costRate}%</span>
          </div>
          <button
            onClick={() => setShowSheet(true)}
            className="shrink-0 flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-3 py-2 rounded-xl transition-colors"
          >
            <span className="text-base leading-none">+</span>
            제품 추가
          </button>
        </div>

        {/* 주문 목록 */}
        <OrderList
          items={items}
          exchangeRate={exchangeRate}
          currency={config.currency}
          onUpdatePrice={updateSalePrice}
          onUpdateQty={updateQty}
          onRemove={removeItem}
        />

        {/* 정산 모드: 총 정산금액 입력 */}
        {mode === 'settle' && items.length > 0 && (
          <div className="mx-4 mb-3 bg-white rounded-2xl border border-gray-200 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 flex-1">실제 정산금액</span>
              <input
                type="text"
                inputMode="decimal"
                value={settlementLocal}
                onChange={e => setSettlementLocal(e.target.value)}
                placeholder="0"
                className="w-28 text-right text-sm font-medium bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-400"
              />
              <span className="text-xs text-gray-400 w-8 shrink-0">{config.currency}</span>
            </div>
            {p(settlementLocal) > 0 && (
              <p className="text-xs text-orange-500 text-right mt-1">≈ {krw(p(settlementLocal) * exchangeRate)}</p>
            )}
          </div>
        )}

        {/* 빈 상태 */}
        {items.length === 0 && (
          <div className="mx-4 mb-4 rounded-2xl bg-gray-50 border border-dashed border-gray-200 p-8 text-center">
            <p className="text-sm text-gray-400">+ 제품 추가 버튼을 눌러<br />주문을 구성하세요</p>
          </div>
        )}

        {/* 결과 대기 */}
        {items.length > 0 && !showResult && (
          <div className="mx-4 mb-3 rounded-2xl bg-gray-50 border border-dashed border-gray-200 p-4 text-center">
            <p className="text-sm text-gray-400">
              {mode === 'predict' ? '판매가를 입력하면 마진이 계산됩니다' : '정산금액을 입력해주세요'}
            </p>
          </div>
        )}

        {/* 결과 카드 */}
        {showResult && (
          <div className="mx-4 mb-3 rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-4 pt-3 pb-2 border-b border-gray-100">
              {mode === 'predict' && <Row label="총 판매금액" value={krw(result.totalSalePriceKRW)} />}
              <Row label="매입원가 합계" value={krw(result.totalCostPrice)} />
              <Row label="└ 부가세환급" value={`-${krw(result.totalVatRefund)}`} />
              <Row label="실효원가 합계" value={krw(result.totalEffectiveCost)} accent />
              {mode === 'predict' && (
                <>
                  <Row label={`수수료 (${feeRate}%)`} value={`-${krw(result.totalFee)}`} />
                  <Row label="예상 정산금액" value={krw(result.predictedSettlement)} />
                </>
              )}
              {mode === 'settle' && (
                <Row label="실제 정산금액" value={krw(result.actualSettlementKRW)} />
              )}
            </div>
            <div className={`px-4 py-4 ${isPositive ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className="flex justify-between items-center">
                <span className="text-base font-semibold text-gray-700">
                  {mode === 'predict' ? '예상 순마진' : '실제 순마진'}
                </span>
                <span className={`text-xl font-bold ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
                  {krw(margin)}
                </span>
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
        )}

        {/* 초기화 */}
        {items.length > 0 && (
          <div className="mx-4 mb-4">
            <button
              onClick={clearOrder}
              className="w-full py-2 text-sm text-gray-400 border border-gray-200 rounded-xl hover:bg-gray-50"
            >
              주문 초기화
            </button>
          </div>
        )}
      </div>

      {/* 제품 선택 Bottom Sheet */}
      {showSheet && (
        <div className="fixed inset-0 z-50 flex flex-col" onClick={() => setShowSheet(false)}>
          <div className="flex-1 bg-black/40" />
          <div
            className="bg-white rounded-t-2xl overflow-hidden"
            style={{ maxHeight: '70vh' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-gray-800">제품 선택</span>
                {totalQty > 0 && (
                  <span className="ml-2 text-xs bg-orange-100 text-orange-600 font-semibold px-1.5 py-0.5 rounded-full">
                    {totalQty}개 선택됨
                  </span>
                )}
              </div>
              <button onClick={() => setShowSheet(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(70vh - 52px)' }}>
              <div className="grid grid-cols-3 gap-2 p-3">
                {PRODUCTS.map(product => {
                  const qty = qtyMap[product.id] || 0;
                  return (
                    <button
                      key={product.id}
                      onClick={() => addItem(product.id)}
                      className={`relative text-left rounded-xl px-2.5 py-2 transition-all active:scale-95 ${
                        qty > 0
                          ? 'bg-orange-50 border border-orange-300'
                          : 'bg-white border border-gray-200 hover:border-orange-200 hover:bg-orange-50'
                      }`}
                    >
                      {qty > 0 && (
                        <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                          {qty}
                        </span>
                      )}
                      <p className="text-xs font-medium text-gray-800 leading-tight pr-4 line-clamp-2">{product.name}</p>
                      <p className="text-xs text-orange-500 mt-1">{product.refPrice.toLocaleString()}원</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
