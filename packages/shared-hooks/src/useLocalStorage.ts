import { useCallback, useState } from 'react';
import { getStoredValue, setStoredValue } from '@company/shared-utils';

/** Persists non-sensitive UI state. Do not use for tokens or personal data. */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => getStoredValue(key, initialValue));

  const update = useCallback(
    (next: T | ((previous: T) => T)) => {
      setValue((previous) => {
        const resolved = typeof next === 'function' ? (next as (previous: T) => T)(previous) : next;
        setStoredValue(key, resolved);
        return resolved;
      });
    },
    [key],
  );

  return [value, update] as const;
}
