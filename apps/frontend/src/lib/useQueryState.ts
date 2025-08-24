import { useSearchParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';

export function useQueryState<T>(
  key: string,
  defaultValue: T,
  parser?: (value: string) => T,
  serializer?: (value: T) => string
) {
  const [searchParams, setSearchParams] = useSearchParams();

  const value = useMemo(() => {
    const param = searchParams.get(key);
    if (param === null) return defaultValue;
    
    if (parser) {
      try {
        return parser(param);
      } catch {
        return defaultValue;
      }
    }
    
    return param as unknown as T;
  }, [searchParams, key, defaultValue, parser]);

  const setValue = useCallback((newValue: T) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      
      if (newValue === defaultValue) {
        newParams.delete(key);
      } else {
        const serialized = serializer ? serializer(newValue) : String(newValue);
        newParams.set(key, serialized);
      }
      
      return newParams;
    });
  }, [setSearchParams, key, defaultValue, serializer]);

  return [value, setValue] as const;
}

// Утилиты для работы с массивами в URL
export function useArrayQueryState(key: string, defaultValue: string[] = []) {
  return useQueryState(
    key,
    defaultValue,
    (value) => value.split(',').filter(Boolean),
    (value) => value.join(',')
  );
}

// Утилиты для работы с числами в URL
export function useNumberQueryState(key: string, defaultValue: number = 0) {
  return useQueryState(
    key,
    defaultValue,
    (value) => parseFloat(value) || defaultValue,
    (value) => value.toString()
  );
}

// Утилиты для работы с булевыми значениями в URL
export function useBooleanQueryState(key: string, defaultValue: boolean = false) {
  return useQueryState(
    key,
    defaultValue,
    (value) => value === 'true',
    (value) => value.toString()
  );
}
