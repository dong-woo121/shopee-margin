import type { CalcMode } from '../types';

interface Props {
  mode: CalcMode;
  onChange: (mode: CalcMode) => void;
}

export default function ModeToggle({ mode, onChange }: Props) {
  return (
    <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mx-4 my-3">
      {(['predict', 'settle'] as CalcMode[]).map(m => (
        <button
          key={m}
          onClick={() => onChange(m)}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === m
              ? 'bg-white dark:bg-gray-700 text-orange-600 dark:text-orange-400 shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          {m === 'predict' ? '📊 예측 모드' : '✅ 정산 모드'}
        </button>
      ))}
    </div>
  );
}
