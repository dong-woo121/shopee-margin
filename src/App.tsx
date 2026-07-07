import { useState, useEffect } from 'react';
import type { CountryCode, CalcMode } from './types';
import { useSettings } from './hooks/useSettings';
import { useExchangeRates } from './hooks/useExchangeRates';
import CountryTabs from './components/CountryTabs';
import ModeToggle from './components/ModeToggle';
import Calculator from './components/Calculator';
import SettingsModal from './components/SettingsModal';

export default function App() {
  const [country, setCountry] = useState<CountryCode>('SG');
  const [mode, setMode] = useState<CalcMode>('predict');
  const [showSettings, setShowSettings] = useState(false);
  const { settings, setExchangeRate, setFeeRate, setVatRate, reset } = useSettings();
  const { fetchRates } = useExchangeRates();

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto min-h-screen flex flex-col bg-gray-50">
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <div>
              <h1 className="text-base font-bold text-gray-900">쇼피 마진 계산기</h1>
              <p className="text-xs text-gray-400">Shopee Cross-border</p>
            </div>
            <button
              onClick={() => setShowSettings(true)}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
            >
              ⚙️
            </button>
          </div>
          <CountryTabs selected={country} onChange={setCountry} />
        </header>

        <main className="flex-1 overflow-y-auto">
          <ModeToggle mode={mode} onChange={setMode} />
          <Calculator country={country} mode={mode} settings={settings} />
        </main>

        <footer className="px-4 py-3 text-center">
          <p className="text-xs text-gray-400">
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
          onReset={reset}
        />
      )}
    </div>
  );
}
