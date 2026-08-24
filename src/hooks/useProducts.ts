import { useState, useEffect, useMemo } from 'react';
import type { Product, Brand } from '../types';
import { DEFAULT_PRODUCTS } from '../constants';

const KEY = 'shopee-products';

function mergeWithDefaults(stored: Product[]): Product[] {
  const storedIds = new Set(stored.map(p => p.id));
  const missing = DEFAULT_PRODUCTS.filter(dp => !storedIds.has(dp.id));
  return missing.length > 0 ? [...stored, ...missing] : stored;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return mergeWithDefaults(JSON.parse(raw) as Product[]);
    } catch {}
    return DEFAULT_PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(products));
  }, [products]);

  const productMap = useMemo(
    () => Object.fromEntries(products.map(p => [p.id, p])) as Record<string, Product>,
    [products]
  );

  const addProduct = (draft: Omit<Product, 'id'>) =>
    setProducts(prev => [...prev, { ...draft, id: `custom_${Date.now()}` }]);

  const updateProduct = (id: string, changes: Partial<Omit<Product, 'id'>>) =>
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...changes } : p));

  const deleteProduct = (id: string) =>
    setProducts(prev => prev.filter(p => p.id !== id));

  const resetToDefaults = () => setProducts(DEFAULT_PRODUCTS);

  const getByBrand = (brand: Brand) => products.filter(p => p.brand === brand);

  return { products, productMap, addProduct, updateProduct, deleteProduct, resetToDefaults, getByBrand };
}
