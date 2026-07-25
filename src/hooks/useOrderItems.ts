import { useState, useEffect } from 'react';
import type { CountryCode, OrderItem } from '../types';

interface OrderState {
  items: OrderItem[];
  settlementLocal: string;
}

const DEFAULT_STATE: OrderState = { items: [], settlementLocal: '' };

export function useOrderItems(country: CountryCode) {
  const key = `shopee-order-${country}`;

  const [state, setState] = useState<OrderState>(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    } catch {}
    return DEFAULT_STATE;
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      setState(raw ? JSON.parse(raw) : DEFAULT_STATE);
    } catch {
      setState(DEFAULT_STATE);
    }
  }, [country, key]);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [state, key]);

  const addItem = (productId: string) =>
    setState(s => ({ ...s, items: [...s.items, { productId, salePrice: '' }] }));

  const removeItem = (index: number) =>
    setState(s => ({ ...s, items: s.items.filter((_, i) => i !== index) }));

  const updateSalePrice = (index: number, price: string) =>
    setState(s => ({
      ...s,
      items: s.items.map((item, i) => i === index ? { ...item, salePrice: price } : item),
    }));

  const setSettlementLocal = (value: string) =>
    setState(s => ({ ...s, settlementLocal: value }));

  const clearOrder = () => setState(DEFAULT_STATE);

  return { items: state.items, settlementLocal: state.settlementLocal, addItem, removeItem, updateSalePrice, setSettlementLocal, clearOrder };
}
