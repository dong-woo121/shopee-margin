import { PRODUCTS } from '../constants';

interface Props {
  onAdd: (productId: string) => void;
}

export default function ProductGrid({ onAdd }: Props) {
  return (
    <div className="mx-4 mb-3">
      <p className="text-xs text-gray-400 mb-2">제품 탭하여 추가</p>
      <div className="grid grid-cols-2 gap-1.5">
        {PRODUCTS.map(product => (
          <button
            key={product.id}
            onClick={() => onAdd(product.id)}
            className="text-left bg-white border border-gray-200 rounded-xl px-3 py-2.5 hover:border-orange-300 hover:bg-orange-50 active:scale-95 transition-all"
          >
            <p className="text-xs font-medium text-gray-800 leading-tight line-clamp-2">{product.name}</p>
            <p className="text-xs text-orange-500 mt-1">{product.refPrice.toLocaleString()}원</p>
          </button>
        ))}
      </div>
    </div>
  );
}
