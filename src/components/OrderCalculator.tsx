import { useMemo, useState } from 'react';
import type { CountryCode, CalcMode, Settings, Product, Brand } from '../types';
import { COUNTRY_MAP } from '../constants';
import { useOrderItems } from '../hooks/useOrderItems';
import { calculateOrder } from '../utils/calcOrder';
import { krw, pct } from '../utils/format';
import OrderList from './OrderList';

interface Props {
  country: CountryCode;
  mode: CalcMode;
  settings: Settings;
  products: Product[];
  productMap: Record<string, Product>;
}

const p = (s: string) => parseFloat(s.replace(/,/g, '')) || 0;

function unitCostLabel(product: Product, costRate: number): string {
  if (product.brand === '인셀덤') {
    return `${Math.round((product.refPrice ?? 0) * costRate / 100).toLocaleString()}원`;
  }
  const cost = Math.round((product.purchasePrice ?? 0) / (product.splitCount || 1));
  return `${cost.toLocaleString()}원${(product.splitCount ?? 1) > 1 ? ` (÷${product.splitCount})` : ''}`;
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between items-baseline py-1.5">
      <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
      <span className={`text-sm font-medium ${accent ? 'text-orange-600 dark:text-orange-400' : 'text-gray-800 dark:text-gray-200'}`}>{value}</span>
    </div>
  );
}

export default function OrderCalculator({ country, mode, settings, products, productMap }: Props) {
  const config = COUNTRY_MAP[country];
  const exchangeRate = settings.exchangeRates[country];
  const feeRate = settings.feeRates[country];
  const { items, settlementLocal, addItem, removeItem, updateQty, updateSalePrice, setSettlementLocal, clearOrder } = useOrderItems(country);
  const [showSheet, setShowSheet] = useState(false);
  const [sheetBrand, setSheetBrand] = useState<Brand>('인셀덤');

  const qtyMap = useMemo(() => {
    const map: Record<string, number> = {};
    items.forEach(item => { map[item.productId] = item.qty; });
    return map;
  }, [items]);

  const result = useMemo(() => {
    const calcItems = items
      .filter(item => productMap[item.productId])
      .map(item => ({
        product: productMap[item.productId],
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
  }, [items, settlementLocal, exchangeRate, feeRate, settings.costRate, settings.vatRate, productMap]);

  const hasFilledItems = items.some(item => p(item.salePrice) > 0);
  const showResult = hasFilledItems && (mode === 'predict' || p(settlementLocal) > 0);
  const marginNoVat = mode === 'predict' ? result.predictedMarginNoVat : result.actualMarginNoVat;
  const marginNoVatRate = mode === 'predict' ? result.predictedMarginNoVatRate : result.actualMarginNoVatRate;
  const margin = mode === 'predict' ? result.predictedMargin : result.actualMargin;
  const marginRate = mode === 'predict' ? result.predictedMarginRate : result.actualMarginRate;
  const isPositive = margin >= 0;
  const totalQty = items.reduce((sum, i) => sum + i.qty, 0);

  const sheetProducts = products.filter(pr => pr.brand === sheetBrand);

  return (
    <>
      <div className="flex flex-col gap-0">
        {/* 환율 / 매입률 + 제품추가 버튼 */}
        <div className="mx-4 my-3 flex items-center gap-2">
          <div className="flex-1 flex items-center justify-between bg-orange-50 dark:bg-orange-950/30 rounded-xl px-3 py-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">1 {config.currency}</span>
            <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">{exchangeRate.toLocaleString()}원</span>
            <span className="text-xs text-gray-400 dark:text-gray-500">인셀덤 매입 {settings.costRate}%</span>
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
          productMap={productMap}
          onUpdatePrice={updateSalePrice}
          onUpdateQty={updateQty}
          onRemove={removeItem}
        />

        {/* 정산 모드: 총 정산금액 입력 */}
        {mode === 'settle' && items.length > 0 && (
          <div className="mx-4 mb-3 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400 flex-1">실제 정산금액</span>
              <input
                type="text"
                inputMode="decimal"
                value={settlementLocal}
                onChange={e => setSettlementLocal(e.target.value)}
                placeholder="0"
                className="w-28 text-right text-sm font-medium bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-400 text-gray-800 dark:text-gray-200 placeholder-gray-300 dark:placeholder-gray-600"
              />
              <span className="text-xs text-gray-400 dark:text-gray-500 w-8 shrink-0">{config.currency}</span>
            </div>
            {p(settlementLocal) > 0 && (
              <p className="text-xs text-orange-500 dark:text-orange-400 text-right mt-1">≈ {krw(p(settlementLocal) * exchangeRate)}</p>
            )}
          </div>
        )}

        {/* 빈 상태 */}
        {items.length === 0 && (
          <div className="mx-4 mb-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-dashed border-gray-200 dark:border-gray-700 p-8 text-center">
            <p className="text-sm text-gray-400 dark:text-gray-500">+ 제품 추가 버튼을 눌러<br />주문을 구성하세요</p>
          </div>
        )}

        {/* 결과 대기 */}
        {items.length > 0 && !showResult && (
          <div className="mx-4 mb-3 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-dashed border-gray-200 dark:border-gray-700 p-4 text-center">
            <p className="text-sm text-gray-400 dark:text-gray-500">
              {mode === 'predict' ? '판매가를 입력하면 마진이 계산됩니다' : '정산금액을 입력해주세요'}
            </p>
          </div>
        )}

        {/* 결과 카드 */}
        {showResult && (
          <div className="mx-4 mb-3 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="px-4 pt-3 pb-2 border-b border-gray-100 dark:border-gray-800">
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
            </div>
            <div className="grid grid-cols-2 divide-x divide-gray-100 dark:divide-gray-800">
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50">
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">부가세 제외</p>
                <p className={`text-lg font-bold ${marginNoVat >= 0 ? 'text-gray-700 dark:text-gray-200' : 'text-red-400'}`}>
                  {krw(marginNoVat)}
                </p>
                <span className={`inline-block text-xs font-medium px-1.5 py-0.5 rounded-full mt-1 ${
                  marginNoVat >= 0 ? 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300' : 'bg-red-100 dark:bg-red-900/30 text-red-500'
                }`}>
                  {pct(marginNoVatRate)}
                </span>
              </div>
              <div className={`px-4 py-3 ${isPositive ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">부가세 환급 후</p>
                <p className={`text-lg font-bold ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                  {krw(margin)}
                </p>
                <span className={`inline-block text-xs font-medium px-1.5 py-0.5 rounded-full mt-1 ${
                  isPositive ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                }`}>
                  {pct(marginRate)}
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
              className="w-full py-2 text-sm text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              주문 초기화
            </button>
          </div>
        )}
      </div>

      {/* 제품 선택 Bottom Sheet */}
      {showSheet && (
        <div className="fixed inset-0 z-50 flex flex-col" onClick={() => setShowSheet(false)}>
          <div className="flex-1 bg-black/50" />
          <div
            className="bg-white dark:bg-gray-900 rounded-t-2xl overflow-hidden"
            style={{ maxHeight: '72vh' }}
            onClick={e => e.stopPropagation()}
          >
            {/* 시트 헤더 */}
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-800 dark:text-gray-200">제품 선택</span>
                  {totalQty > 0 && (
                    <span className="text-xs bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 font-semibold px-1.5 py-0.5 rounded-full">
                      {totalQty}개
                    </span>
                  )}
                </div>
                <button onClick={() => setShowSheet(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none">✕</button>
              </div>
              {/* 브랜드 필터 */}
              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                {(['인셀덤', '애터미'] as Brand[]).map(b => (
                  <button
                    key={b}
                    onClick={() => setSheetBrand(b)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      sheetBrand === b
                        ? 'bg-white dark:bg-gray-700 text-orange-600 dark:text-orange-400 shadow-sm'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* 제품 그리드 */}
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(72vh - 100px)' }}>
              <div className="grid grid-cols-3 gap-2 p-3">
                {sheetProducts.map(product => {
                  const qty = qtyMap[product.id] || 0;
                  return (
                    <button
                      key={product.id}
                      onClick={() => addItem(product.id)}
                      className={`relative text-left rounded-xl px-2.5 py-2 transition-all active:scale-95 ${
                        qty > 0
                          ? 'bg-orange-50 dark:bg-orange-900/30 border border-orange-300 dark:border-orange-700'
                          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-orange-200 dark:hover:border-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/20'
                      }`}
                    >
                      {qty > 0 && (
                        <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                          {qty}
                        </span>
                      )}
                      <p className="text-xs font-medium text-gray-800 dark:text-gray-200 leading-tight pr-4 line-clamp-2">{product.name}</p>
                      <p className="text-xs text-orange-500 dark:text-orange-400 mt-1">{unitCostLabel(product, settings.costRate)}</p>
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
