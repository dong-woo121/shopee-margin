import { useState } from 'react';
import type { Product, Brand } from '../types';

interface Props {
  products: Product[];
  onClose: () => void;
  onAdd: (draft: Omit<Product, 'id'>) => void;
  onUpdate: (id: string, changes: Partial<Omit<Product, 'id'>>) => void;
  onDelete: (id: string) => void;
}

const inputCls = 'flex-1 text-right text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1.5 focus:outline-none focus:border-orange-400 text-gray-800 dark:text-gray-200';

function unitCost(p: Product): number {
  if (p.brand === '인셀덤') return p.refPrice ?? 0;
  return Math.round((p.purchasePrice ?? 0) / (p.splitCount || 1));
}

export default function ProductManageModal({ products, onClose, onAdd, onUpdate, onDelete }: Props) {
  const [brand, setBrand] = useState<Brand>('인셀덤');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editSplit, setEditSplit] = useState('1');
  const [showAdd, setShowAdd] = useState(false);
  const [addName, setAddName] = useState('');
  const [addPrice, setAddPrice] = useState('');
  const [addSplit, setAddSplit] = useState('1');

  const filtered = products.filter(p => p.brand === brand);

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setEditName(p.name);
    setEditPrice(String(p.brand === '인셀덤' ? (p.refPrice ?? '') : (p.purchasePrice ?? '')));
    setEditSplit(String(p.splitCount ?? 1));
    setShowAdd(false);
  };

  const saveEdit = (p: Product) => {
    const price = parseInt(editPrice.replace(/,/g, '')) || 0;
    const split = Math.max(1, parseInt(editSplit) || 1);
    const changes: Partial<Product> = { name: editName.trim() || p.name };
    if (p.brand === '인셀덤') changes.refPrice = price;
    else { changes.purchasePrice = price; changes.splitCount = split; }
    onUpdate(p.id, changes);
    setEditingId(null);
  };

  const handleAdd = () => {
    if (!addName.trim()) return;
    const price = parseInt(addPrice.replace(/,/g, '')) || 0;
    const split = Math.max(1, parseInt(addSplit) || 1);
    const draft: Omit<Product, 'id'> = brand === '인셀덤'
      ? { brand, name: addName.trim(), refPrice: price }
      : { brand, name: addName.trim(), purchasePrice: price, splitCount: split };
    onAdd(draft);
    setAddName(''); setAddPrice(''); setAddSplit('1'); setShowAdd(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex flex-col" onClick={onClose}>
      <div className="flex-1 bg-black/50" />
      <div
        className="bg-white dark:bg-gray-900 rounded-t-2xl overflow-hidden"
        style={{ maxHeight: '85vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200">제품 관리</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none">✕</button>
        </div>

        {/* 브랜드 탭 */}
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mx-4 mt-3">
          {(['인셀덤', '애터미'] as Brand[]).map(b => (
            <button
              key={b}
              onClick={() => { setBrand(b); setEditingId(null); setShowAdd(false); }}
              className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-all ${
                brand === b
                  ? 'bg-white dark:bg-gray-700 text-orange-600 dark:text-orange-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {b}
            </button>
          ))}
        </div>

        {/* 제품 목록 */}
        <div className="overflow-y-auto px-4 pb-4 mt-3" style={{ maxHeight: 'calc(85vh - 140px)' }}>
          <div className="space-y-1.5">
            {filtered.map(p => (
              <div key={p.id} className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden">
                {editingId === p.id ? (
                  /* 편집 모드 */
                  <div className="p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400 w-10 shrink-0">이름</span>
                      <input
                        type="text"
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        className={inputCls}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400 w-10 shrink-0">
                        {p.brand === '인셀덤' ? '정가' : '공급가'}
                      </span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={editPrice}
                        onChange={e => setEditPrice(e.target.value)}
                        className={inputCls}
                      />
                      <span className="text-xs text-gray-400 dark:text-gray-500">원</span>
                    </div>
                    {p.brand === '애터미' && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400 w-10 shrink-0">분할수</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={editSplit}
                          onChange={e => setEditSplit(e.target.value)}
                          className={inputCls}
                        />
                        <span className="text-xs text-orange-500 dark:text-orange-400 shrink-0">
                          = {Math.round((parseInt(editPrice.replace(/,/g, '')) || 0) / (Math.max(1, parseInt(editSplit) || 1))).toLocaleString()}원
                        </span>
                      </div>
                    )}
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => { onDelete(p.id); setEditingId(null); }}
                        className="flex-1 py-1.5 text-xs text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        삭제
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="flex-1 py-1.5 text-xs text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        취소
                      </button>
                      <button
                        onClick={() => saveEdit(p)}
                        className="flex-1 py-1.5 text-xs font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600"
                      >
                        저장
                      </button>
                    </div>
                  </div>
                ) : (
                  /* 일반 모드 */
                  <div
                    className="flex items-center px-3 py-2.5 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => startEdit(p)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">{p.name}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        {p.brand === '인셀덤'
                          ? `정가 ${(p.refPrice ?? 0).toLocaleString()}원`
                          : `공급가 ${(p.purchasePrice ?? 0).toLocaleString()}원${(p.splitCount ?? 1) > 1 ? ` ÷${p.splitCount} = ${unitCost(p).toLocaleString()}원` : ''}`
                        }
                      </p>
                    </div>
                    <span className="text-xs text-gray-300 dark:text-gray-600 ml-2">편집 ›</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 제품 추가 */}
          {showAdd ? (
            <div className="mt-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-3 space-y-2">
              <p className="text-xs font-semibold text-orange-600 dark:text-orange-400">{brand} 제품 추가</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400 w-10 shrink-0">이름</span>
                <input type="text" value={addName} onChange={e => setAddName(e.target.value)} placeholder="제품명" className={inputCls} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400 w-10 shrink-0">
                  {brand === '인셀덤' ? '정가' : '공급가'}
                </span>
                <input type="text" inputMode="numeric" value={addPrice} onChange={e => setAddPrice(e.target.value)} placeholder="0" className={inputCls} />
                <span className="text-xs text-gray-400 dark:text-gray-500">원</span>
              </div>
              {brand === '애터미' && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400 w-10 shrink-0">분할수</span>
                  <input type="text" inputMode="numeric" value={addSplit} onChange={e => setAddSplit(e.target.value)} placeholder="1" className={inputCls} />
                  <span className="text-xs text-orange-500 dark:text-orange-400 shrink-0">
                    = {Math.round((parseInt(addPrice.replace(/,/g, '')) || 0) / (Math.max(1, parseInt(addSplit) || 1))).toLocaleString()}원
                  </span>
                </div>
              )}
              <div className="flex gap-2 pt-1">
                <button onClick={() => setShowAdd(false)} className="flex-1 py-1.5 text-xs text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-lg">취소</button>
                <button onClick={handleAdd} className="flex-1 py-1.5 text-xs font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600">추가</button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => { setShowAdd(true); setEditingId(null); }}
              className="mt-3 w-full py-2.5 text-sm text-orange-500 dark:text-orange-400 border border-dashed border-orange-300 dark:border-orange-700 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/20"
            >
              + {brand} 제품 추가
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
