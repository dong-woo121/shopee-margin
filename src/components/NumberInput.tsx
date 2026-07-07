interface Props {
  label: string;
  value: string;
  onChange: (v: string) => void;
  suffix?: string;
  hint?: string;
  placeholder?: string;
  inputMode?: 'decimal' | 'numeric';
}

export default function NumberInput({ label, value, onChange, suffix, hint, placeholder, inputMode = 'decimal' }: Props) {
  return (
    <div className="flex items-center gap-2 py-2.5 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-600 w-24 shrink-0">{label}</span>
      <div className="flex items-center gap-1 flex-1 min-w-0">
        <input
          type="text"
          inputMode={inputMode}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder ?? '0'}
          className="w-full text-right text-sm font-medium bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 focus:outline-none focus:border-orange-400 focus:bg-white transition-colors"
        />
        {suffix && <span className="text-xs text-gray-500 shrink-0 w-8">{suffix}</span>}
      </div>
      {hint && <span className="text-xs text-orange-600 shrink-0">{hint}</span>}
    </div>
  );
}
