import type { OrderItem, Product } from '../types';
import { krw } from '../utils/format';

interface Props {
  items: OrderItem[];
  exchangeRate: number;
  currency: string;
  productMap: Record<string, Product>;
  onUpdatePrice: (index: number, price: string) => void;
  onUpdateQty: (index: number, qty: number) => void;
  onRemove: (index: number) => void;
}

const p = (s: string) => parseFloat(s.replace(/,/g, '')) || 0;

export default function OrderList({ items, exchangeRate, currency, productMap, onUpdatePrice, onUpdateQty, onRemove }: Props) {
  if (items.length === 0) return null;

  return (
    <div className="mx-4 mb-3 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">주문 내역</span>
        <span className="text-xs text-gray-400 dark:text-gray-500">총 {items.reduce((sum, i) => sum + i.qty, 0)}개</span>
      </div>
      {items.map((item, index) => {
        const product = productMap[item.productId];
        if (!product) return null;
        const lineKRW = p(item.salePrice) * exchangeRate * item.qty;
        const brandTag = product.brand === '애터미'
          ? <span className="text-[10px] text-blue-400 dark:text-blue-500 mr-1">AT</span>
          : <span className="text-[10px] text-orange-400 dark:text-orange-500 mr-1">IS</span>;

        return (
          <div key={index} className="px-3 py-2.5 border-b border-gray-100 dark:border-gray-800 last:border-0">
            <div className="flex items-center gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">
                  {brandTag}{product.name}
                </p>
              </div>
              {/* 수량 +/- */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => onUpdateQty(index, item.qty - 1)}
                  className="w-6 h-6 flex items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm font-bold"
                >
                  −
                </button>
                <span className="w-5 text-center text-sm font-semibold text-gray-800 dark:text-gray-200">{item.qty}</span>
                <button
                  onClick={() => onUpdateQty(index, item.qty + 1)}
                  className="w-6 h-6 flex items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm font-bold"
                >
                  +
                </button>
              </div>
              {/* 판매가 입력 */}
              <input
                type="text"
                inputMode="decimal"
                value={item.salePrice}
                onChange={e => onUpdatePrice(index, e.target.value)}
                placeholder="0"
                className="w-16 text-right text-sm font-medium bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1 focus:outline-none focus:border-orange-400 text-gray-800 dark:text-gray-200 placeholder-gray-300 dark:placeholder-gray-600 shrink-0"
              />
              <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">{currency}</span>
              <button
                onClick={() => onRemove(index)}
                className="text-gray-300 dark:text-gray-600 hover:text-red-400 dark:hover:text-red-400 transition-colors text-lg leading-none shrink-0"
              >
                ×
              </button>
            </div>
            {lineKRW > 0 && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 text-right">
                {item.qty > 1 && <span className="mr-1">{currency} {item.salePrice} × {item.qty} =</span>}
                ≈ {krw(lineKRW)}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
