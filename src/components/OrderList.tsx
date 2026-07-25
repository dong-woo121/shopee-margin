import type { OrderItem } from '../types';
import { PRODUCT_MAP } from '../constants';
import { krw } from '../utils/format';

interface Props {
  items: OrderItem[];
  exchangeRate: number;
  currency: string;
  onUpdatePrice: (index: number, price: string) => void;
  onRemove: (index: number) => void;
}

const p = (s: string) => parseFloat(s.replace(/,/g, '')) || 0;

export default function OrderList({ items, exchangeRate, currency, onUpdatePrice, onRemove }: Props) {
  if (items.length === 0) return null;

  return (
    <div className="mx-4 mb-3 bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-600">주문 내역</span>
        <span className="text-xs text-gray-400">{items.length}개 품목</span>
      </div>
      {items.map((item, index) => {
        const product = PRODUCT_MAP[item.productId];
        const krwAmount = p(item.salePrice) * exchangeRate;

        return (
          <div key={index} className="flex items-center gap-2 px-3 py-2.5 border-b border-gray-100 last:border-0">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-800 truncate">{product.name}</p>
              {krwAmount > 0 && (
                <p className="text-xs text-gray-400 mt-0.5">≈ {krw(krwAmount)}</p>
              )}
            </div>
            <input
              type="text"
              inputMode="decimal"
              value={item.salePrice}
              onChange={e => onUpdatePrice(index, e.target.value)}
              placeholder="0"
              className="w-20 text-right text-sm font-medium bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-orange-400 shrink-0"
            />
            <span className="text-xs text-gray-400 w-7 shrink-0">{currency}</span>
            <button
              onClick={() => onRemove(index)}
              className="text-gray-300 hover:text-red-400 transition-colors text-xl leading-none shrink-0 w-5 text-center"
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
}
