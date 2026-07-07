import { COUNTRIES } from '../constants';
import type { CountryCode } from '../types';

interface Props {
  selected: CountryCode;
  onChange: (code: CountryCode) => void;
}

export default function CountryTabs({ selected, onChange }: Props) {
  return (
    <div className="flex border-b border-gray-200 bg-white">
      {COUNTRIES.map(c => (
        <button
          key={c.code}
          onClick={() => onChange(c.code)}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            selected === c.code
              ? 'border-b-2 border-orange-500 text-orange-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <span className="block text-lg leading-none">{c.flag}</span>
          <span className="block text-xs mt-0.5">{c.name}</span>
        </button>
      ))}
    </div>
  );
}
