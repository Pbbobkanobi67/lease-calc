'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  tooltip?: string;
  className?: string;
  decimals?: number;
}

export function NumberInput({
  label,
  value,
  onChange,
  min = 0,
  max = 1000000,
  step = 1,
  prefix,
  suffix,
  tooltip,
  className,
  decimals = 0,
}: NumberInputProps) {
  const [localValue, setLocalValue] = useState(value.toString());
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setLocalValue(value.toFixed(decimals));
    }
  }, [value, isFocused, decimals]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setLocalValue(raw);
    
    const parsed = parseFloat(raw);
    if (!isNaN(parsed) && parsed >= min && parsed <= max) {
      onChange(parsed);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    const parsed = parseFloat(localValue);
    if (isNaN(parsed)) {
      setLocalValue(value.toFixed(decimals));
    } else {
      const clamped = Math.min(max, Math.max(min, parsed));
      onChange(clamped);
      setLocalValue(clamped.toFixed(decimals));
    }
  };

  return (
    <div className={cn("space-y-1", className)}>
      <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
        {label}
        {tooltip && (
          <span className="text-gray-400 cursor-help" title={tooltip}>
            ⓘ
          </span>
        )}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            {prefix}
          </span>
        )}
        <input
          type="number"
          value={localValue}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          step={step}
          min={min}
          max={max}
          className={cn(
            "w-full px-3 py-2 border border-gray-300 rounded-lg",
            "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            "text-gray-900 text-base",
            prefix && "pl-7",
            suffix && "pr-12"
          )}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
