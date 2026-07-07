import type { CalcMode } from '../types';

interface Props {
  mode: CalcMode;
  onChange: (mode: CalcMode) => void;
}

export default function ModeToggle({ mode, onChange }: Props) {
  return (
    <div className="flex bg-gray-100 rounded-xl p-1 mx-4 my-3">
      {(['predict', 'settle'] as CalcMode[]).map(m => (
        <button
          key={m}
          onClick={() => onChange(m)}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === m
              ? 'bg-white text-orange-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {m === 'predict' ? '📊 예측 모드' : '✅ 정산 모드'}
        </button>
      ))}
    </div>
  );
}
