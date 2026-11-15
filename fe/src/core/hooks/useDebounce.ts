"use client";

import { useEffect, useState } from "react";

export interface UseDebounceProps<T> {
  value: T;
  delay?: number;
}

export default function useDebounce<T>({ value, delay = 500 }: UseDebounceProps<T>): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

