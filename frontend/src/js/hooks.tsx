import { useRef, useEffect } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import type { RootState, Dispatch } from './state/store';

export const useCCDispatch = (): Dispatch => useDispatch<Dispatch>();
export const useCCSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * Returns the immediately previous value associated with a changing value.
 * @param value The value to track
 * @returns The previous value of the tracked value (undefined on first call)
 */
export function usePrevious<T>(value: T): T|undefined {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef<T>();

  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes

  // Return previous value (happens before update in useEffect above)
  return ref.current;
}
