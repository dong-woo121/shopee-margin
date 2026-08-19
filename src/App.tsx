import { useState, useEffect } from 'react';
import type { CountryCode, CalcMode } from './types';
import { useSettings } from './hooks/useSettings';
import { useExchangeRates } from './hooks/useExchangeRates';
import { useTheme } from './hooks/useTheme';
import { useProducts } from './hooks/useProducts';
import CountryTabs from './components/CountryTabs';
import ModeToggle from './components/ModeToggle';
import OrderCalculator from './components/OrderCalculator';
import SettingsModal from './components/SettingsModal';
import ProductManageModal from './components/ProductManageModal';

export default function App() {
  const [country, setCountry] = useState<CountryCode>('SG');
  const [mode, setMode] = useState<CalcMode>('predict');
  const [showSettings, setShowSettings] = useState(false);
  const [showProductManage, setShowProductManage] = useState(false);
  const { settings, setExchangeRate, setFeeRate, setVatRate, setCostRate, reset } = useSettings();
  const { fetchRates } = useExchangeRates();
  const { isDark, toggle: toggleTheme } = useTheme();
  const { products, productMap, addProduct, updateProduct, deleteProduct } = useProducts();

  useEffect(() => {
    fetchRates().then(rates => {
      if (rates) {
        (Object.entries(rates) as [CountryCode, number][]).forEach(([code, rate]) => {
          setExchangeRate(code, rate);
        });
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-lg mx-auto min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
        <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <div>
              <h1 className="text-base font-bold text-gray-900 dark:text-gray-100">쇼피 마진 계산기</h1>
              <p className="text-xs text-gray-400 dark:text-gray-500">Shopee Cross-border</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors text-base"
              >
                {isDark ? '☀️' : '🌙'}
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
              >
                ⚙️
              </button>
            </div>
          </div>
          <CountryTabs selected={country} onChange={setCountry} />
        </header>

        <main className="flex-1 overflow-y-auto">
          <ModeToggle mode={mode} onChange={setMode} />
          <OrderCalculator
            country={country}
            mode={mode}
            settings={settings}
            products={products}
            productMap={productMap}
          />
        </main>

        <footer className="px-4 py-3 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-600">
            {mode === 'predict'
              ? '판매 전 예상 마진을 계산합니다'
              : '실제 정산금액 기준으로 마진을 확인합니다'}
          </p>
        </footer>
      </div>

      {showSettings && (
        <SettingsModal
          settings={settings}
          onClose={() => setShowSettings(false)}
          onSetExchangeRate={setExchangeRate}
          onSetFeeRate={setFeeRate}
          onSetVatRate={setVatRate}
          onSetCostRate={setCostRate}
          onReset={reset}
          onManageProducts={() => setShowProductManage(true)}
        />
      )}

      {showProductManage && (
        <ProductManageModal
          products={products}
          onClose={() => setShowProductManage(false)}
          onAdd={addProduct}
          onUpdate={updateProduct}
          onDelete={deleteProduct}
        />
      )}
    </div>
  );
}
